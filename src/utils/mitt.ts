import mitt from "mitt"


type Events = {
    move: {dragNode: Element, isDownward: boolean, isRightward: boolean};
    unMove: any;
    runAnimation: any;
};

const emitter = mitt<Events>()

export default emitter
