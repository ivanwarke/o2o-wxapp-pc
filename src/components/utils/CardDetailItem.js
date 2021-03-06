import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Upload from 'rc-upload';

import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import { SERVER, PREFIX, APISET, TOKEN } from '../../config/api';

/**
 * CardDetailImage
 */
class CardDetailImage extends React.Component {
  constructor(props) {
    super();
    const self = this;
    this.uploaderProps = {
      action: SERVER + PREFIX + APISET['uploadFile'],
      data: { a: 1, b: 2 },
      headers: {
        Authorization: TOKEN,
      },
      multiple: true,
      beforeUpload(file) {
        console.log('beforeUpload', file.name);
      },
      onStart: (file) => {
        console.log('onStart', file.name);
      },
      onSuccess(file) {
        console.log('onSuccess', file);
        self.props.upload(file);
      },
      onProgress(step, file) {
        console.log('onProgress', Math.round(step.percent), file.name);
      },
      onError(err) {
        console.log('onError', err);
        self.setState({ alertOpen: true, alertMsg: '✘ 上传失败！' }, () => { props.closeAlert });
      },
    };
    this.state = {
    };
  }

  render() {
    const { label, imageUrl, disabled } = this.props;
    return (
      <div className="card-detail-item">
        <div className="card-detail-item-label">
          {label}：
        </div>
        <Upload {...this.uploaderProps} ref="inner" disabled={disabled ? true : false}>
          <div className="card-detail-item-image">
            {
              imageUrl ? <img src={SERVER + imageUrl} /> : <div className="card-detail-item-default-img"></div>
            }
          </div>
        </Upload>
      </div>
    );
  }
}

/**
 * CardDetailText
 */
class CardDetailText extends React.Component {
  constructor(props) {
    super();
    this.state = {
      text: props.text ? props.text : '',
      textDisabled: props.textDisabled || false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
			this.setState({
				text: nextProps.text ? nextProps.text : '',
        textDisabled: nextProps.textDisabled || false,
			});
		}
  }

  handleChange(e, text) {
    this.setState({ text });
    this.props.textChange(text);
  }

  render() {
    const { label, styles, hintText } = this.props;
    const { text, textDisabled } = this.state;
    return (
      <div className="card-detail-item">
        <div className="card-detail-item-label">
          {label}：
        </div>
        <div className="card-detail-item-text">
          <TextField 
            hintText={!hintText ? `请输入${label}` : `${hintText}`} 
            value={text} 
            disabled={textDisabled}
            style={ Object.assign({}, { minWidth: '300px' }, styles) }
            onChange={(e, text) => this.handleChange(e, text)}
          />
        </div>
      </div>
    );
  }
}

/**
 * CardDetailToggle
 */
class CardDetailToggle extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isInputChecked: props.truefalse ? true : false,
      toggleText: props.truefalse ? '是' : '否',
    };
  }

  handleToggle(e, isInputChecked) {
    this.setState({ 
      isInputChecked,
      toggleText: isInputChecked ? '是': '否',
    });
    this.props.toggleChange(isInputChecked);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
			this.setState({
				isInputChecked: nextProps.truefalse ? true : false,
        toggleText: nextProps.truefalse ? '是': '否',
			});
		}
  }

  render() {
    const { label, truefalse } = this.props;
    return (
      <div className="card-detail-item">
        <div className="card-detail-item-label">
          {label}：
        </div>
        <div className="card-detail-item-toggle">
          <Toggle
            label={this.state.toggleText}
            labelPosition="right"
            toggled={this.state.isInputChecked}
            onToggle={(e, isInputChecked) => this.handleToggle(e, isInputChecked)}
          />
        </div>
      </div>
    );
  }
}

/**
 * CardDetailSelect
 */
class CardDetailSelect extends React.Component {
  constructor(props) {
    super();
    this.state = {
      selected: {},
      dataList: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.dataList) {
      const { selected, dataList, unification } = nextProps;
      this.setState({ selected, dataList, unification });
		}
  }

  handleSelect(e, key, payload) {
    const selected = Object.assign({}, this.state.selected);
    selected._id = payload;
    selected[this.state.unification] = e.target.innerText;
    this.setState({ selected });
    this.props.selectChange(selected);
  }

  render() {
    const { label, unification, appendItem } = this.props;
    return (
      <div className="card-detail-item">
        <div className="card-detail-item-label">
          {label}：
        </div>
        <div className="card-detail-item-select">
          <SelectField
            value={this.state.selected === null ? '*': this.state.selected._id }
            style={{ minWidth: '300px' }}
            floatingLabelText={`请选择${label}`}
            onChange={(e, key, payload) => this.handleSelect(e, key, payload)}
          >
            {
              appendItem ? <MenuItem key={appendItem.value} value={appendItem.value} primaryText={appendItem.primaryText} /> : null
            }            
            {
              this.state.dataList.map( item => (
                <MenuItem key={item._id} value={item._id} primaryText={item[unification]} /> 
              ))
            }
          </SelectField>
        </div>
      </div>
    );
  }
}

/**
 * CardDetailTools
 */
class CardDetailTools extends React.Component {
  constructor(props) {
    super();
    this.state = {
      
    };
  }

  render() {
    const styles = {
      btn: {
        margin: '0 16px 0 0',
      }
    }
    const { historyBack, isAddingStatus, onlyReturn } = this.props;
    return (
      <div className="card-detail-item">
        <div className="card-detail-item-label">
          操作：
        </div>
        {
          onlyReturn 
          ?
          <div className="card-detail-item-tools">
            <Link to={`${historyBack}`}>
              <RaisedButton label="返回" style={styles.btn} />
            </Link>
          </div> 
          :
          <div className="card-detail-item-tools">
            <Link to={`${historyBack}`}>
              <RaisedButton label="返回" style={styles.btn} />
            </Link>
            <RaisedButton 
              label="保存" 
              primary={true} 
              style={styles.btn} 
              onClick={ this.props.handleUpdate } 
            />
            <RaisedButton 
              label="删除" 
              secondary={true} 
              style={styles.btn} 
              disabled={isAddingStatus}
              onClick={ this.props.handleDelete } 
            />
          </div>
        }
      </div>
    );
  }

} 

export {
  CardDetailImage,
  CardDetailText,
  CardDetailToggle,
  CardDetailSelect,
  CardDetailTools,
};
