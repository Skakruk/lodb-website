import React, {Component} from 'react'
// Drag and Drop
import {DragDropContext} from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
// Material UI
import {GridList} from 'material-ui/GridList'
import Subheader from 'material-ui/Subheader'

class ReorderableGridList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dndConstraint: this.props.dndConstraint || (Math.random() + 1).toString()
        }
    }

    render() {
        const {children, ...props} = this.props;
        const {dndConstraint} = this.state;
        return (
            <GridList { ...props }>
                {React.Children.map(children, (child, idx) => {
                    if (['div'].includes(child.type)) return child;
                    return React.cloneElement(child, {
                        listIdentifier: dndConstraint,
                        index: idx
                    })
                })}
            </GridList>
        );
    }
}

export default DragDropContext(HTML5Backend)(ReorderableGridList)