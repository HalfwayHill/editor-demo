import mitt from "mitt"


type Events = {
    move: {isDownward: boolean, isRightward: boolean};
    unMove: any;
    runAnimation: any;
    hideArea: any;
};

const emitter = mitt<Events>()

export default emitter
