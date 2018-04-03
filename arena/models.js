module.exports = {
    /**
     * player
     */
    player : function (userId) {
        this.userId = userId;
        this.name = "Anonymous";
        this.cards = [];
        this.win = 0;
        this.all = 0;
    },

    /**
     * card
     */
    card : function (cardId) {
        this.cardId = cardId;
        this.atk = 0;
        this.cost = 0;
        this.growth = [0];
        this.dscrpt = "Nothing";
    }
};