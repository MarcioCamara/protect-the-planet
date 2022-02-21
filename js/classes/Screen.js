class Screen {
    constructor() {
        this.object = document.getElementById('gameScreen');
        this.width = this.object.offsetWidth;
        this.height = this.object.offsetHeight;
        this.xStart = this.object.offsetLeft;
        this.xEnd = this.object.offsetLeft + this.width;
        this.yStart = this.object.offsetTop;
        this.yEnd = this.object.offsetTop + this.height;
    }
}