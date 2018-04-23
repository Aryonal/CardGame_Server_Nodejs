# Card Gaming Server Side

> using node.js

[TOC]

## Client

### I. STAGE

准备阶段，这个阶段主要用于整理牌组，升级卡牌等。

#### 1. HTTP GET /stage

请求当前玩家的卡牌，牌组等信息。返回的卡牌，牌组中只包含卡牌id，想要卡牌详细信息可以通过id查找当前玩家的卡牌数据，以及卡牌图片。其中发送的时间为本地缓存更新的服务器时间。

send json = 

```json
{
    "userId": "123",
    "auth": "***"，
    "localTime": "2018-04-04-13-00"
}
```

**Response**

json = 

```json
{
    "code": 0,
    "msg": "OK",
    "serverTime": "2018-04-04-13-00"
    "data": {
        "player": {
            "userId": "123",
            "name": "aryon",
            "win": 0,
            "all": 0,
        	"allCards": [0,1,2,3],
            "stageCount": 3,
        	"stagedCards": [[0,1,2],[1,2,3],[2,3,4]]
        }
    }
}
```

或

```json
{
    "code": 1,
    "msg": "cached",
    "serverTime": "2018-04-04-13-00"
}
```

如果返回*code* 为*1*，也需要更新本地缓存时间。

#### 2. HTTP POST /stage

更新卡牌，牌组信息。

send json =

```json
{
    "userId": "123",
    "auth": "***",
    "operate": "updateStage",
    "data": {
        "stagedCards": [[0,1,2],[1,2,3],[2,3,4]]
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

make WebSocket connection with server. Wait until receive reply

Event **"intoRoom"**, json =

```json
{
    "code": 0,
    "msg": "OK",
    "data": {
        "roomId": "0123",
        "rivalId": "321"
    }
}
```

and then just communicate with server using WebSocket.

### II. DUEL

#### 1. Event "RivalReady"

json =

```json
{
    "data": {
        "magic": 0,
        "score": 0
    }
}
```

客户端开始倒计时，在倒计时结束或玩家确定出牌后发送信息

Event **"Ready"** json =

```json

```



### III. UPDATE



### IV. ERROR

