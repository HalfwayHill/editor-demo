import mitt from "mitt"


type Events = {
    move: {isDownward: boolean, isRightward: boolean};
    unMove: any;
    runAnimation: any;
    hideArea: any;
    save: any;
    preview: any;
    clearCanvas: any;
};

const emitter = mitt<Events>()

export default emitter
