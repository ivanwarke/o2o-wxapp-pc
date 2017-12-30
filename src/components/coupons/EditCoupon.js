import React from 'react';

import { requestGetData, requestDeleteData, requestPostData, requestPatchData } from '../../config/api';
import { CardDetailText, CardDetailTools } from '../utils/CardDetailItem';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Snackbar from 'material-ui/Snackbar';

class EditCoupon extends React.Component {
  constructor(props) {
    super();
    this.state = {
      isAddingStatus: true, // ture是增加，false是修改
      alertOpen: false,
      alertMsg: '',
      coupon: {
        _id: '',
        couponType: -1,
        value: '',
        limit: '',
        remark: '',
      },
      showDisc: null,
      limitError: null,
      valueError: null,
    };
  }

  componentWillMount() {
    const self = this;
    if (this.props.match.params.id) {
      this.setState({ isAddingStatus: false }, () => {
        this.fetchData();
      });
    }
  }

  fetchData() {
    const self = this;
    requestGetData('coupons', `id=${self.props.match.params.id}`)
      .then((res) => {
        self.setState({ 
          coupon: res.data,
          showDisc: res.data.couponType === 0 ? res.data.value : null
        });
      })
      .catch((e) => {
        console.error(e);
      }); 
  }

  closeAlert() {
    setTimeout(() => {
      this.setState({ alertOpen: false, alertMsg: '' });
    }, 4000);
  }

  handleSave() {

  }

  handleDelete() {
    const self = this;
    requestDeleteData('coupons', self.props.match.params.id)
      .then((res) => {
        self.props.history.replace('/couponlist');
      })
      .catch((e) => {
        console.error(e);
      });
  }
  
  closeAlert() {

  }

  changeCouponType(e, val) {
    const coupon = Object.assign({}, this.state.coupon);
    coupon.couponType = parseInt(val);
    this.setState({ coupon });
  }

  handleDiscountChange(e, val) {
    const num = Number(val);
    const len = val.length;
    if (!isNaN(num) && (len <= 2) && val[0] !== '0') {
      const coupon = Object.assign({}, this.state.coupon);
      coupon.limit = null;
      len === 0 ? coupon.value = '' : coupon.value = num * 1.0 / (10 ** len);
      this.setState({ coupon }, () => {
        // console.warn(`coupon value: ${this.state.coupon.value}`)
      });
    }
  }

  handleOffLimitChange(e, val) {
    const num = Number(val);
    const len = val.length;
    if (!isNaN(num) && len <= 4 && val !== '0') {
      const coupon = Object.assign({}, this.state.coupon);
      if (len === 0) {
        coupon.limit = '';
        this.setState({ coupon, limitError: '必填' });
      } else {
        coupon.limit = num ;
        this.setState({ coupon, limitError: null, valueError: num < this.state.coupon.value ? '数值超出' : null });
      }
    } 
  }

  handleOffValueChange(e, val) {
    const num = Number(val);
    const len = val.length;
    if (!isNaN(num) && len <= 4 && val !== '0') {
      const coupon = Object.assign({}, this.state.coupon);
      if (len === 0) {
        coupon.value = '';
        this.setState({ coupon, valueError: '必填' });
      } else {
        coupon.value = num ;
        this.setState({ coupon, valueError: num > this.state.coupon.limit ? '数值超出' : null });
      }
    }
    
  }

  render() {
    return (
      <div className="card-detail-box">
        {
          !this.state.isAddingStatus ? 
          <CardDetailText 
            label={'ID'} 
            text={this.state.coupon._id} 
            textDisabled={true} 
          /> :null
        }
        <div className="card-detail-item">
          <div className="card-detail-item-label">
            优惠券类型
          </div>
          <div className="card-detail-item-text">
            <RadioButtonGroup 
              name="couponType"
              valueSelected={this.state.coupon.couponType}
              onChange={(e, val) => this.changeCouponType(e, val)} 
              style={{display:'flex'}} 
            >
              <RadioButton 
                value={0} 
                label="打折" 
                disabled={!this.state.isAddingStatus && this.state.coupon.couponType === 1} 
                style={{ width: '200px' }}
              />
              <RadioButton 
                value={1} 
                label="满减" 
                disabled={!this.state.isAddingStatus && this.state.coupon.couponType === 0}
              />
            </RadioButtonGroup>
          </div>
        </div>
        {
          this.state.coupon.couponType === 0 ?
          <div className="card-detail-item">
            <div className="card-detail-item-label">
              打折额度
            </div>
            <div className="card-detail-item-text">
              <span style={{ marginTop: '15px' }}>0.&nbsp;</span>
              <TextField 
                name="discount" 
                value={ this.state.coupon.value ? this.state.coupon.value * (10 ** (`${this.state.coupon.value}`.length - 2)) : '' } 
                style={{ width: '40px' }} 
                onChange={(e, val) => this.handleDiscountChange(e, val)}
              /> 
            </div> 
          </div> : null
        }
        {
          this.state.coupon.couponType === 1 ?
          <div className="card-detail-item">
            <div className="card-detail-item-label">
              满减额度
            </div>
            <div className="card-detail-item-text">
              <span style={{ marginTop: '12px' }}>满&nbsp;</span>
              <TextField 
                name="offlimit" 
                value={this.state.coupon.limit} 
                errorText={this.state.limitError}
                style={{ width: '50px' }} 
                onChange={(e, val) => this.handleOffLimitChange(e, val)}
              /> 
              <span style={{ marginTop: '12px' }}>&nbsp;减&nbsp;</span>
              <TextField 
                name="offvalue" 
                value={this.state.coupon.value} 
                errorText={this.state.valueError}
                style={{ width: '50px' }} 
                onChange={(e, val) => this.handleOffValueChange(e, val)}
              /> 
            </div> 
          </div> : null
        }
        <CardDetailTools 
          historyBack="/couponlist"
          handleUpdate={() => this.handleSave()}
          handleDelete={() => this.handleDelete()}
        />
        <Snackbar
          open={this.state.alertOpen}
          message={this.state.alertMsg}
          onRequestClose={this.handleRequestClose}
          contentStyle={{ textAlign: 'center' }}
        />
      </div>
    );
  }
}

export default EditCoupon;