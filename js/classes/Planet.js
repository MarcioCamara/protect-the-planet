class Planet {
    constructor() {
        this.health = undefined;
        this.healthBarObject = undefined;
        this.healthBarObjectSize = undefined;
        this.destroyedMessage = undefined;
    }

    static initialize() {
        this.health = 120;
        this.healthBarObject = document.getElementById('planetHealthBar');
        this.healthBarObjectSize = this.healthBarObject.offsetWidth;
        this.destroyedMessage = document.getElementById('planetDestroyed');
    }
}