import React, {Component, PropTypes} from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import {GridTile} from 'material-ui/GridList';
import {findDOMNode} from 'react-dom';

const dndType = props => props.listIdentifier || 'reorderableGridTile';

const itemSource = {
    beginDrag(props) {
        let {index} = props;
        return {
            index
        }
    }
};

const itemTarget = {
    hover(props, monitor, component) {
        let {id: dragId, index: dragIndex} = monitor.getItem();
        let {id: hoverId, index: hoverIndex} = props;
        if (dragIndex === hoverIndex) return; // Don't replace items with themselves

        let hoveringOffsets = findDOMNode(component).getBoundingClientRect()
        let penPercent = 0.50 // Percentage distance into next item before swap
        let penMin = (hoveringOffsets.right - hoveringOffsets.left) * penPercent
        let clientOffset = monitor.getClientOffset()
        let penX;

        // Dragging downwards
        if (dragIndex < hoverIndex) penX = clientOffset.x - hoveringOffsets.left
        // Dragging upwards
        if (dragIndex > hoverIndex) penX = hoveringOffsets.right - clientOffset.x

        if (!(penX > penMin)) return;

        props.moveItem({dragId, dragIndex, hoverId, hoverIndex})

        monitor.getItem().index = hoverIndex
    }
};


class ReordableGridTile extends Component {
    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        isDragging: PropTypes.bool.isRequired,
        moveItem: PropTypes.func.isRequired
    };

    componentDidMount() {
        const img = new Image();
        img.onload = () => this.props.connectDragPreview(img);
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    }

    render() {

        const {
            children,
            connectDragSource,
            connectDropTarget,
            isDragging,
            title,
            style,
            titlePosition,
            actionIcon,
            actionPosition,
            subtitle,
            cols,
            rows
        } = this.props;

        const tileProps = {
            title,
            titlePosition,
            actionIcon,
            actionPosition,
            subtitle,
            cols,
            rows,
        };

        const opacity = isDragging ? 0.6 : 1;

        return (<GridTile
            ref={instance => {
                connectDropTarget(findDOMNode(instance));
                connectDragSource(findDOMNode(instance))
            }}
            {...tileProps}
            style={{
                ...style,
                opacity
            }}
        >
            {children}
        </GridTile>);
    }
}

const connectTarget = connect => ({
    connectDropTarget: connect.dropTarget()
});

const connectSource = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
});

export default (
    DropTarget(dndType, itemTarget, connectTarget)(
        DragSource(dndType, itemSource, connectSource)(
            ReordableGridTile
        )
    )
)