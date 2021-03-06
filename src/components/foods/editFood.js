import React from 'react';

import { requestGetData, requestPostData, requestPatchData, requestDeleteData } from '../../config/api';
import { CardDetailImage, CardDetailText, CardDetailToggle, CardDetailSelect, CardDetailTools } from '../utils/CardDetailItem';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class EditFood extends React.Component {
  constructor(props) {
    super();
    
    this.state = {
      openDialog: false,
      isAddingStatus: true, // ture是增加，false是修改
      alertOpen: false,
      alertMsg: '',
      food: {
        _id: '',
        foodName: '',
        price: '',
        imageUrl: '',
        sellout: false, 
        description: '',
        category: {},
        coupon: {},
      },
      categoryList: [],
      couponList: [],
    }
  }

  componentWillMount() {
    const self = this;
    if (this.props.match.params.id) {
      this.setState({ isAddingStatus: false }, () => {
        this.fetchData();
      });
    }
    this.getCategoryList();
    this.getCouponList();
  }

  fetchData() {
    const self = this;
    requestGetData('foods', `id=${self.props.match.params.id}`)
      .then((res) => {
        self.setState({ food: res.data });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  getCategoryList() {
    const self = this;
    requestGetData('categories')
      .then((res) => {
        self.setState({ categoryList: res.data });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  getCouponList() {
    const self = this;
    requestGetData('coupons')
      .then((res) => {
        self.setState({ couponList: res.data });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  changeFoodName(val) {
    const food = Object.assign({}, this.state.food);
    food.foodName = val;
    this.setState({ food });
  }

  changePrice(val) {
    const food = Object.assign({}, this.state.food);
    food.price = val;
    this.setState({ food });
  }

  changeDescription(val) {
    const food = Object.assign({}, this.state.food);
    food.description = val;
    this.setState({ food });
  }

  changeSellout(val) {
    const food = Object.assign({}, this.state.food);
    food.sellout = val;
    this.setState({ food });
  }

  changeCategory(obj) {
    const food = Object.assign({}, this.state.food);
    food.category = {};
    food.category._id = obj._id;
    food.category.categoryName = obj.categoryName;
    this.setState({ food });
  }

  changeCoupon(obj) {
    const food = Object.assign({}, this.state.food);
    if (obj._id !== '*' ) {
      food.coupon = {};
      food.coupon._id = obj._id;
      food.coupon.remark = obj.remark;
    } else {
      food.coupon = null;
    }
    this.setState({ food });
  }

  closeAlert() {
    setTimeout(() => {
      this.setState({ alertOpen: false, alertMsg: '' });
    }, 4000);
  }
  
  afterUpload(file) {
    const food = Object.assign({}, this.state.food);
    food.imageUrl = file.imageUrl;
    this.setState({ food });
  }

  deleteAction() {
    this.setState({ openDialog: true });
  }

  handleSave() {
    const self = this;
    const { foodName, description, price, imageUrl, sellout } = this.state.food;
    const category = this.state.food.category._id || null;
    const coupon = this.state.food.coupon && this.state.food.coupon._id || null;
    const food = { foodName, description, price, imageUrl, sellout, category, coupon }; 

    if (this.state.isAddingStatus) {
      requestPostData('foods', '', food)
        .then((res) => {
          if (res.status === 201) {
            self.setState({ alertOpen: true, alertMsg: '√ 保存成功！' }, () => { 
              self.props.history.replace('/foodlist');
              self.closeAlert(); 
            });
          } else {
            const errMsg = JSON.parse(JSON.stringify(res)).response.data.message || '出错了, 联系开发者010-26277567';
            self.setState({ alertOpen: true, alertMsg: `✘ ${errMsg} ！` }, () => { self.closeAlert() });
          }
        })
        .catch((err) => {
          self.setState({ alertOpen: true, alertMsg: '✘ 服务器开小差了！' }, () => { self.closeAlert() });
        });
    } else {
      food._id = this.state.food._id;
      requestPatchData('foods', self.props.match.params.id, food)
        .then((res) => {
          if (res.status === 200) {
            self.setState({ alertOpen: true, alertMsg: '√ 保存成功！' }, () => { 
              self.props.history.replace('/foodlist');
              self.closeAlert(); 
            });
          } else {
            const errMsg = JSON.parse(JSON.stringify(res)).response.data.message || '出错了, 联系开发者010-26277567';
            self.setState({ alertOpen: true, alertMsg: `✘ ${errMsg} ！` }, () => { self.closeAlert() });
          }
        })
        .catch((err) => {
          self.setState({ alertOpen: true, alertMsg: '✘ 服务器开小差了！' }, () => { self.closeAlert() });
        });
    }
    
  }

  handleOpenDialog() {
    if (this.state.selected.length > 0) {
      this.handleDelete();
    }
    this.setState({ openDialog: false });
  }
  
  handleCloseDialog() {
    this.setState({ openDialog: false });
  }

  handleDelete() {
    const self = this;
    requestDeleteData('foods', self.props.match.params.id)
      .then((res) => {
        self.props.history.replace('/foodlist');
      })
      .catch((e) => {
        console.error(e);
      });
  }

  render() {
    const actions = [
      <FlatButton label="确认" primary={false}  onClick={() => this.handleOpenDialog()} />,
      <FlatButton label="取消" primary={true} keyboardFocused={true} onClick={() => this.handleCloseDialog()} />,
    ];
    return (
      <div className="card-detail-box">
        <CardDetailImage 
          label={'图片'} 
          imageUrl={this.state.food.imageUrl}  
          upload={file => this.afterUpload(file)}
          closeAlert={() => this.closeAlert()}
        />
        {
          !this.state.isAddingStatus ? 
          <CardDetailText 
            label={'ID'} 
            text={this.state.food._id} 
            textDisabled={true} 
          /> :null
        }
        <CardDetailToggle 
          label={'售罄'} 
          truefalse={this.state.food.sellout} 
          toggleChange={val => this.changeSellout(val)}
        />
        <CardDetailText 
          label={'名称'} 
          text={this.state.food.foodName} 
          textChange={val => this.changeFoodName(val) } 
        />
        <CardDetailText 
          label={'价格'} 
          text={this.state.food.price} 
          textChange={val => this.changePrice(val) } 
        />
        <CardDetailText 
          label={'介绍'} 
          text={this.state.food.description} 
          textChange={val => this.changeDescription(val) } 
        />
        <CardDetailSelect 
          label={'分类'} 
          selected={this.state.food.category} 
          unification={'categoryName'} 
          dataList={this.state.categoryList} 
          selectChange={val => this.changeCategory(val)}
        />
        <CardDetailSelect 
          label={'优惠券'} 
          selected={this.state.food.coupon} 
          unification={'remark'} 
          dataList={this.state.couponList} 
          appendItem={{value: '*', primaryText: '(无)'}}
          selectChange={val => this.changeCoupon(val)}
        />
        <CardDetailTools 
          historyBack="/foodlist"
          isAddingStatus={this.state.isAddingStatus}
          handleUpdate={() => this.handleSave()}
          handleDelete={() => this.handleDelete()}
        />
        <Snackbar
          open={this.state.alertOpen}
          message={this.state.alertMsg}
          onRequestClose={this.handleRequestClose}
          contentStyle={{ textAlign: 'center' }}
        />
        <Dialog title="警告" actions={actions} modal={false} open={this.state.openDialog}>
          是否确定删除？
        </Dialog>
      </div>
    );
  }

}

export default EditFood;