class Hald {
    constructor(lutSize, lutTitle) {
        this.lutSize = lutSize;
    }
    createHald(lutSize) {
        if (!lutSize)
            lutSize = this.lutSize;
        let haldSize = Math.round((this.lutSize ** 3) ** 0.5);
        let hald = document.createElement("canvas");
        hald.width = hald.height = haldSize;
        let haldData = hald.getContext("2d");
        let r, g, b = g = r = 0;
        function exportHald(target, lutSize) {
            let download = document.createElement('a');
            download.download = "Neutral_" + lutSize + ".png";
            download.href = target.toDataURL("image/png");
            download.name = "Export HALD";
            download.click();
        }
        function setPixel(target, values, position) {
            function value(color) {
                return Math.round((255 / (lutSize - 1)) * color);
            }
            target.fillStyle = "rgb(" + value(values[0]) + "," + value(values[1]) + "," + value(values[2]) + ")";
            target.fillRect(position[0], position[1], 1, 1);
        }
        for (let y = 0; y < hald.height; y++) {
            for (let x = 0; x < hald.width; x++) {
                if (r >= this.lutSize) {
                    r = 0;
                    g += 1;
                }
                if (g >= this.lutSize) {
                    g = 0;
                    b += 1;
                }
                setPixel(haldData, [r, g, b], [x, y]);
                r += 1;
            }
        }
        exportHald(hald, lutSize);
    }
    static exportCube(lutTitle) {
        if (!lutTitle)
            lutTitle = "OpenLUTJs";
        let hald = document.createElement('canvas');
        let haldData = hald.getContext('2d');
        function exportCube(text, lutTitle) {
            let exportFile = document.createElement('a');
            let file = new Blob([text], { type: 'text/plain' });
            exportFile.href = URL.createObjectURL(file);
            exportFile.download = lutTitle + '.cube';
            exportFile.click();
        }
        function setText(lutSize, lutTitle) {
            let text = "#Generated by OpenLUTJs\n#Code by SirSerch\n";
            text += ("TITLE " + lutTitle + "_" + lutSize + "\n");
            text += ("LUT_3D_SIZE " + lutSize + "\n\n");
            return text;
        }
        function generateCube(image, lutTitle) {
            hald.width = hald.height = image.width;
            haldData.drawImage(image, 0, 0);
            let lutSize = Math.round((hald.width * hald.height) ** 0.3333);
            console.log(lutSize);
            let cube = setText(lutSize, lutTitle);
            for (let y = 0; y < hald.height; y++) {
                for (let x = 0; x < hald.width; x++) {
                    var r = (haldData.getImageData(x, y, 1, 1).data[0] / 255).toFixed(6);
                    var g = (haldData.getImageData(x, y, 1, 1).data[1] / 255).toFixed(6);
                    var b = (haldData.getImageData(x, y, 1, 1).data[2] / 255).toFixed(6);
                    cube += r + " " + g + " " + b + "\n";
                }
            }
            exportCube(cube, lutTitle);
        }
        function loadImage(file, lutTitle) {
            let imageReader = new FileReader();
            imageReader.onload = () => {
                let imageHald = new Image();
                imageHald.onload = () => {
                    generateCube(imageHald, lutTitle);
                };
                imageHald.src = String(imageReader.result);
            };
            imageReader.readAsDataURL(file[0]);
        }
        function inputHald(lutTitle) {
            let selectFile = document.createElement('input');
            selectFile.type = 'file';
            selectFile.click();
            selectFile.onchange = (e) => {
                loadImage(selectFile.files, lutTitle);
            };
        }
        inputHald(lutTitle);
    }
}
//# sourceMappingURL=lutCreatorJs.js.map