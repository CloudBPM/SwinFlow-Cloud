function DockerImages() {
    this.imagesTag = null;
    this.imagePort = null;
};
DockerImages.prototype.parseFromJSON = function (json) {
    this.imagesTag = json.imagesTag;
    this.imagePort = json.imagePort;
};
DockerImages.prototype.stringifyforJSON = function () {
    var d = new DockerImages();
    d.imagesTag = this.imagesTag;
    d.imagePort = this.imagePort;
};