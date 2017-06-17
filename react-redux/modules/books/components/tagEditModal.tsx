import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Modal } from 'simple-react-bootstrap';

import BootstrapButton, { AjaxButton } from 'applicationRoot/components/bootstrapButton';
import * as actionCreators from '../reducers/tags/actionCreators';
import CustomColorPicker from 'applicationRoot/components/customColorPicker';
import {selectEntireTagsState, EntireTagsStateType, filterTags} from '../reducers/tags/reducer';
import GenericLabelSelect from 'applicationRoot/components/genericLabelSelect';
import ColorsPalette from 'applicationRoot/components/colorsPalette';

const TagEditDeleteInfo = props =>
    <div className="row">
        <div className="col-xs-12">
            <h4>Delete tag { props.tagName }</h4>

            <div style={{ marginTop: '5px'}}>
                <AjaxButton running={props.deleting} runningText="Deleting" onClick={() => props.deleteTag(props._id)} preset="danger-sm">Delete</AjaxButton>
                <BootstrapButton onClick={props.cancelDeleteTag} preset="default-sm" className="pull-right">Cancel</BootstrapButton>
            </div>
            <hr />
        </div>
    </div>;

interface ILocalProps {
    onDone: any,
    editTagOpen: boolean
}

@connect(selectEntireTagsState, { ...actionCreators })
export default class TagEditModal extends Component<EntireTagsStateType & ILocalProps & typeof actionCreators, any> {
    state = {
        editingTag: null,
        editingTagName: '',
        tagSearch: '',
        searchedTags: this.props.allTagsSorted
    }

    setTagSearch = value => this.setState({
        tagSearch: value,
        searchedTags: filterTags(this.props.allTagsSorted, value)
    });

    newTag = () => this.startEditing({ _id: '', name: '', backgroundColor: '', textColor: '' });
    editTag = tag => {
        this.startEditing(tag);
        this.setTagSearch('');
    }
    startEditing = tag => this.setState({editingTag: tag, editingTagName: tag.name});
    cancelTagEdit = () => this.setState({editingTag: null});

    setNewTagName = value => this.setEditingValue('name', value);
    setNewTagBackgroundColor = value => this.setEditingValue('backgroundColor', value);
    setNewTagTextColor = value => this.setEditingValue('textColor', value);
    setEditingValue = (name, value) => this.setState(({editingTag}) => ({ editingTag: {...editingTag, [name]: value} }));
    
    tagName: any
    render(){
        let props = this.props,
            {deleteInfo, onDone, editTagOpen} = props,
            {editingTag, editingTagName, tagSearch} = this.state,
            textColors = ['#ffffff', '#000000'];

        return (
            <Modal className="fade" show={!!editTagOpen} onHide={onDone}>
                <Modal.Header>
                    <button type="button" className="close" onClick={onDone} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title">Edit tags</h4>
                </Modal.Header>
                <Modal.Body style={{ paddingBottom: 0 }}>
                    <div className="visible-xs">
                        <BootstrapButton onClick={this.newTag} preset="info-xs">Add new tag <i className="fa fa-fw fa-plus"></i></BootstrapButton>
                        <br />
                        <br />
                    </div>
                    <div className="row">
                        <div className="col-xs-11">
                            <GenericLabelSelect
                                inputProps={{ placeholder: 'Edit tag', value: tagSearch, onChange: evt => this.setTagSearch(evt.target.value) }}
                                suggestions={this.state.searchedTags}
                                onSuggestionSelected={item => this.editTag(item)} />
                        </div>
                        <div className="col-xs-1" style={{ padding: 0 }}>
                            <BootstrapButton className="hidden-xs" onClick={this.newTag} preset="info-xs"><i className="fa fa-fw fa-plus-square"></i></BootstrapButton>
                        </div>
                    </div>
                    <br />

                    { editingTag ?
                        <div className="panel panel-info">
                            <div className="panel-heading">
                                { editingTag._id ? `Edit ${editingTagName}` : 'New Tag' }
                                { editingTag && editingTag._id ? <BootstrapButton onClick={e => props.beginDeleteTag(editingTag._id)} preset="danger-xs" className="pull-right"><i className="fa fa-fw fa-trash"></i></BootstrapButton> : null }
                            </div>
                            <div className="panel-body">
                                <div>
                                    { deleteInfo ?
                                        <TagEditDeleteInfo
                                            {...deleteInfo}
                                            deleting={props.deleting}
                                            cancelDeleteTag={props.cancelDeleteTag}
                                            deleteTag={props.deleteTag} /> : null }
                                    <div className="row">
                                        <div className="col-xs-6">
                                            <div className="form-group">
                                                <label>Tag name</label>
                                                <input className="form-control" value={editingTag.name} onChange={evt => this.setNewTagName(evt.target.value)} />
                                            </div>
                                        </div>
                                        <div className="col-xs-9">
                                            <div className="form-group">
                                                <label>Label color</label>
                                                <div>
                                                    <ColorsPalette currentColor={editingTag.backgroundColor} colors={props.colors} onColorChosen={this.setNewTagBackgroundColor} />
                                                    <CustomColorPicker onColorChosen={this.setNewTagBackgroundColor} currentColor={editingTag.backgroundColor} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-3">
                                            <div className="form-group">
                                                <label>Text color</label>
                                                <div>
                                                    <ColorsPalette colors={textColors} onColorChosen={this.setNewTagTextColor} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xs-12">
                                            <div style={{ marginTop: '10px' }} className="form-group">
                                                <label>Preview &nbsp;&nbsp;</label>
                                                <div className="label label-default" style={{ backgroundColor: editingTag.backgroundColor, color: editingTag.textColor }}>{ editingTag.name }</div>
                                            </div>
                                        </div>
                                    </div>
                                    <br style={{ clear: 'both' }} />

                                    <a className="btn btn-primary" onClick={e => { props.createOrUpdateTag(); e.preventDefault();} }>Save</a>
                                    <a className="btn btn-default pull-right" onClick={this.cancelTagEdit}>Cancel</a>
                                </div>
                            </div>
                        </div>
                        : null
                    }
                </Modal.Body>
                <Modal.Footer>
                    <BootstrapButton onClick={onDone}>Close</BootstrapButton>
                </Modal.Footer>
            </Modal>
        )
    }
}