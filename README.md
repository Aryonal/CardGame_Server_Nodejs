# Game server

[TOC]

## processing communication

message format

```python
class msg(object):
    '''
    id: int: msg send to room id
	src: str: whom msg's from, 'client' or 'arena' or any other
	data: dict: msg data
    '''
    def __init__(self, id, src, data):
        self.id = id
        self.src = src
        self.data = data
```



## Client

### I. STAGE

准备阶段，这个阶段主要用于整理牌组，升级卡牌等。

#### 1. HTTP GET /stage

请求当前玩家的卡牌，牌组等信息。返回的卡牌，牌组中只包含卡牌id，想要卡牌详细信息可以通过id查找当前玩家的卡牌数据，以及卡牌图片。其中发送的时间为本地缓存更新的服务器时间。

send json = 

```json
{
    "userId": "u123",
    "auth": "***"
}
```

**Response**

json = 

```json
{
    "code": 0,
    "msg": "OK",
    "data": {
        "userId": "u123",
        "name": "aryon",
        "win": 0,
        "all": 0,
        "pool": [0,1,2,3],
        "staged": [[0,1,2],[1,2,3],[2,3,4]]
    }
}
```



#### 2. HTTP POST /stage

更新卡牌，牌组信息。

send json =

```json
{
    "userId": "u123",
    "auth": "***",
    "operate": "updateStage",
    "data": {
        "staged": [[0,1,2],[1,2,3],[2,3,4]]
    }
}
```

\* *operate* 包括 *updateStage*, *updateCard* 等.

**RESPONSE**

json =

```json
{
    "code": 0,
    "msg": "OK"
}
```

#### 3. Make WS Connect

make WebSocket connection with server. Emit Server Event **"openRoom"**, json =

```json
{
    userId: "u123",
    auth: "***"
}
```

> Meanwhile, server add new player to arena, reply until two players are ready.

 Wait until receive reply

Client Broadcast Event **"intoRoom"**, json =

```json
{
    roomId: "r0123",
    players: ["u123", "u234"]
}
```

and then just communicate with server using WebSocket.

### II. DUEL

卡牌对战。

#### 1. Client Broadcast Event "startGame"

json =

```json
{
    round: 0
}
```

客户端开始倒计时，在倒计时结束或玩家确定出牌后发送事件，并保存 Board 上的牌。

Server Event **"ready"** json =

```json
{
    userId: "u123",
    roomId: "r123"
}
```

#### 2. Client Broadcast Event "question"

json =
```json
{
    question: "What's the weather today?",
    options: ["Fine.", "Good."]
}
```

客户端开始倒计时，等待玩家回答问题，并记录玩家答题剩余时间

Server Event **"answer"**, json =
```json
{
    userId: "u123",
    roomId: "r123",
    data: {
        magic: 0,
        score: 0,
        combo: 0,
        answer: 0,
        board: [0,1,2]
    }
}
```

#### 3. Client Broadcast Event "update"

当前轮结束，更新玩家的 magic，score等数据。

json =

```json
{
    gameOver: false,
    players: [{
        userId: 'u123',
        win: true,
        right: true,
        magic: 0,
        score: 1
    },
    {
        userId: 'u124',
        win: false,
        right: true,
        magic: 0,
        score: -1
    }]
}
```

等结算结束，如果游戏没有结束，发送事件。等待服务器发送 "startGame" 事件。

Server Event **"nextRound"**, json =

```json
{
    userId: 'u123',
    roomId: 'r0'
}
```

### IV. ERROR



## Server

### I. STAGE

#### Server Event 'openRoom'

Add new player to a room and broadcast room id and players' id.

json =

```json
{
    userId: 'u123',
    auth: '***'
}
```

When both players are ready, emit Client Broadcast Event **'intoRoom'**.

json =

```json
{
    roomId: "r0123",
    players: ["u123", "u234"]
}
```

And emit Cient Broadcast Event **'startGame'**.

json =

```json
{}
```



### II. DUEL

#### Server Event 'ready'

'ready' means ready for a question.

json =

```json
{
    userId: 'u123',
    roomId: 'r0'
}
```

When both are ready, emit Client Broadcast Event **'question'**

json =

```json
{
    question: 'What\'s the weather today?',
    options: ['Fine.', 'Bad.', 'I don\'t know.']
}
```

#### Server Event 'answer'

json =

```json
{
    userId: 'u123',
    roomId: 'r0',
    data: {
        magic: 0,
        score: 0,
        combo: 0,
        answer: 0,
        board: ['c0','c1','c2']
    }
}
```

Check if player's game value (magic and score) identical.

When both are ready, **Judge** whether Game over, who wins, and update player game values.

Emit Client Broadcast Event "update"

json =

```json
{
    gameOver: false,
    players: [{
        userId: 'u123',
        win: true,
        right: true,
        magic: 0,
        score: 1
    },
    {
        userId: 'u124',
        win: false,
        right: true,
        magic: 0,
        score: -1
    }]
}
```



#### Server Event **"nextRound"**

json =

```json
{
    userId: 'u123',
    roomId: 'r0'
}
```

When both are ready, emit Client Broadcast Event **'startGame'**

json =

```json
{
    round: 1
}
```





### inner protocol

进程间通信协议，在实例一个 msg 时，msg.src = 'arena'，msg.data 格式为：

```python
{
    "cmd": "cmd" # "add guest",...
    "data": "any data"
}
```
Entire
```python
{
    self.id = "room_id",
    self.src = "arena",
    self.data = {
        "cmd": "cmd",
        "data": {
        }
    }
}
```

### new guest

To Room
```python
{
    "cmd": "add_guest",
    "data": {
        "userId": "u123"
    }
}
```
Room 回信时也要 msg.src 设置成发信方，比如 new guest 成功后的反馈， msg.src == 'arena'

### guest leave

To Room

```python
{
    "cmd": "guest_leave",
    "data": {
        "userId": "u123"
    }
}
```



### question

To Room

```python
{
    "cmd": "question"
}
```

Return data = question dict.

### close room

To Room
```python
{
    "cmd": "close_room"
}
```

## protocol with client
