// pages/zhuce/zhuce.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kindLists: [],
    // objectArray: [
    //   {
    //     id: 0,
    //     name: '请选择问题处理结果'
    //   },
    //   {
    //     id: 1,
    //     name: '锁在门上-暂时空置'
    //   },
    //   {
    //     id: 2,
    //     name: '锁已拆-需要回收'
    //   },
    //   {
    //     id: 3,
    //     name: '锁已拆-还会装回去'
    //   },
    //   {
    //     id: 4,
    //     name: '未接通'
    //   }
    // ],
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    // Do something when page ready.  等价于mounted
    wx.request({
      url: 'http://paas.xuanqiyun.com:8088/api/service2/api27',
      method: 'POST',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (val) {
        console.log(val.data.data);
        var array = [];
        array.push("请选择所属公司");
        for(var i=0;i<val.data.data.length;i++){
          array.push(val.data.data[i].name)
        }
        console.log(array);
        that.setData({
          kindLists: array
        })
      },
    })
  },

  bindPickerChange: function (e) {
    console.log(this.data.kindLists);
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})