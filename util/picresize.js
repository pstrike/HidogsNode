var PicResize = {
    resizePicFile: function(file, max_width, max_height, handling) {
        //if(file.type.match(/image.*/)) {
        // get image orientation
        loadImage.parseMetaData(
            file,
            function (data) {
                var orientation = -1;
                if(data.exif) {
                    orientation = data.exif.get('Orientation');
                }

                // Create a file reader
                var reader = new FileReader();
                reader.onload = function (readerEvent) {
                    var image = new Image();
                    image.onload = function (imageEvent) {
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(image, 0, 0);

                        // Set Width and Height
                        var MAX_WIDTH = max_width;
                        var MAX_HEIGHT = max_height;
                        var width = image.width;
                        var height = image.height;

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width;
                                width = MAX_WIDTH;

                                if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                }
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height;
                                height = MAX_HEIGHT;

                                if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                }
                            }
                        }
                        canvas.width = width;
                        canvas.height = height;

                        // handle image orientation
                        if (orientation > 4 && orientation < 9) {
                            canvas.width = height;
                            canvas.height = width;
                        }

                        var ctx = canvas.getContext("2d");
                        switch (orientation) {
                            case 2:
                                // horizontal flip
                                ctx.translate(width, 0);
                                ctx.scale(-1, 1);
                                break;
                            case 3:
                                // 180° rotate left
                                ctx.translate(width, height);
                                ctx.rotate(Math.PI);
                                break;
                            case 4:
                                // vertical flip
                                ctx.translate(0, height);
                                ctx.scale(1, -1);
                                break;
                            case 5:
                                // vertical flip + 90 rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.scale(1, -1);
                                break;
                            case 6:
                                // 90° rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(0, -height);
                                break;
                            case 7:
                                // horizontal flip + 90 rotate right
                                ctx.rotate(0.5 * Math.PI);
                                ctx.translate(width, -height);
                                ctx.scale(-1, 1);
                                break;
                            case 8:
                                // 90° rotate left
                                ctx.rotate(-0.5 * Math.PI);
                                ctx.translate(-width, 0);
                                break;
                        }

                        ctx.drawImage(image, 0, 0, width, height);

                        var dataUrl = canvas.toDataURL("image/jpeg");

                        handling(dataURItoBlob(dataUrl));
                    }.bind(this);
                    image.src = readerEvent.target.result;
                }.bind(this);

                reader.readAsDataURL(file);
            }
        );
        //}
        //else {
        //    console.log("inputted file is not img type");
        //}
    },

    resizePicSrc: function(src, max_width, max_height, handling) {
        alert('img resizer');

        var image = new Image();

        image.onload = function (imageEvent) {

            alert('img resizer onload');

            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);

            alert('img resizer draw image');
            // Set Width and Height
            var MAX_WIDTH = max_width;
            var MAX_HEIGHT = max_height;
            var width = image.width;
            var height = image.height;

            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;

                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;

                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                }
            }
            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(image, 0, 0, width, height);

            alert('img resizer draw resize image');

            var dataUrl = canvas.toDataURL("image/jpeg");

            alert('img resizer dataUrl');

            handling(dataURItoBlob(dataUrl));
        }.bind(this);

        image.src = src;
    },
};


//exports.resize = function (file, max_width, max_height, handling) {
//    //if(file.type.match(/image.*/)) {
//        // get image orientation
//        loadImage.parseMetaData(
//            file,
//            function (data) {
//                var orientation = -1;
//                if(data.exif) {
//                    orientation = data.exif.get('Orientation');
//                }
//
//                // Create a file reader
//                var reader = new FileReader();
//                reader.onload = function (readerEvent) {
//                    var image = new Image();
//                    image.onload = function (imageEvent) {
//                        var canvas = document.createElement("canvas");
//                        var ctx = canvas.getContext("2d");
//                        ctx.drawImage(image, 0, 0);
//
//                        // Set Width and Height
//                        var MAX_WIDTH = max_width;
//                        var MAX_HEIGHT = max_height;
//                        var width = image.width;
//                        var height = image.height;
//
//                        if (width > height) {
//                            if (width > MAX_WIDTH) {
//                                height *= MAX_WIDTH / width;
//                                width = MAX_WIDTH;
//
//                                if (height > MAX_HEIGHT) {
//                                    width *= MAX_HEIGHT / height;
//                                    height = MAX_HEIGHT;
//                                }
//                            }
//                        } else {
//                            if (height > MAX_HEIGHT) {
//                                width *= MAX_HEIGHT / height;
//                                height = MAX_HEIGHT;
//
//                                if (width > MAX_WIDTH) {
//                                    height *= MAX_WIDTH / width;
//                                    width = MAX_WIDTH;
//                                }
//                            }
//                        }
//                        canvas.width = width;
//                        canvas.height = height;
//
//                        // handle image orientation
//                        if (orientation > 4 && orientation < 9) {
//                            canvas.width = height;
//                            canvas.height = width;
//                        }
//
//                        var ctx = canvas.getContext("2d");
//                        switch (orientation) {
//                            case 2:
//                                // horizontal flip
//                                ctx.translate(width, 0);
//                                ctx.scale(-1, 1);
//                                break;
//                            case 3:
//                                // 180° rotate left
//                                ctx.translate(width, height);
//                                ctx.rotate(Math.PI);
//                                break;
//                            case 4:
//                                // vertical flip
//                                ctx.translate(0, height);
//                                ctx.scale(1, -1);
//                                break;
//                            case 5:
//                                // vertical flip + 90 rotate right
//                                ctx.rotate(0.5 * Math.PI);
//                                ctx.scale(1, -1);
//                                break;
//                            case 6:
//                                // 90° rotate right
//                                ctx.rotate(0.5 * Math.PI);
//                                ctx.translate(0, -height);
//                                break;
//                            case 7:
//                                // horizontal flip + 90 rotate right
//                                ctx.rotate(0.5 * Math.PI);
//                                ctx.translate(width, -height);
//                                ctx.scale(-1, 1);
//                                break;
//                            case 8:
//                                // 90° rotate left
//                                ctx.rotate(-0.5 * Math.PI);
//                                ctx.translate(-width, 0);
//                                break;
//                        }
//
//                        ctx.drawImage(image, 0, 0, width, height);
//
//                        var dataUrl = canvas.toDataURL("image/jpeg");
//
//                        handling(dataURItoBlob(dataUrl));
//                    }.bind(this);
//                    image.src = readerEvent.target.result;
//                }.bind(this);
//
//                reader.readAsDataURL(file);
//            }
//        );
//    //}
//    //else {
//    //    console.log("inputted file is not img type");
//    //}
//};

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var dw = new DataView(ab);
    for(var i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i));
    }

    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], {type: mimeString});
};

module.exports = PicResize;