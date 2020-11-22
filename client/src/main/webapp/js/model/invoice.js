function Invoice() {
     this.invoiceId =null; //发票ID
     this.invoiceType =null;  //发票类型 增值税普通发票 增值税专用发票
     this.receivePersonType=null;  //接收人类型 1、单位 2、个人
     this.invoiceHead=null;  // 发票抬头
     this.invoiceContent=null;  //发票内容 1、软件服务费 2、培训服务费
     this.receiveType=null;  //接收方式 1、电子邮件 2、快递
     this.email=null;   //电子邮箱
     this.taxpayersNumber=null;  //纳税人识别号
     this.companyAddress=null;  // 公司地址
     this.financialTel=null;  //公司财务电话
     this.depositaryBank=null;  //开户行
     this.bankNumber=null;   //银行账号
     this.receiveName=null;  //收件人姓名
     this.receiveTel=null;  //收件人电话
     this.receiveAddress=null;  //收件人地址
     this.note=null; //备注
     this.invoiceStatus = null;
     this.orderId = null;
     this.applyTime = null;
     this.orderPrice = null;
}
Invoice.prototype.parseFromJSON=function (json) {
     var invoice = new Invoice();
     invoice.invoiceId = json.invoiceId;
     invoice.bankNumber = json.bankNumber;
     invoice.companyAddress = json.companyAddress;
     invoice.depositaryBank = json.depositaryBank;
     invoice.email = json.email;
     invoice.financialTel = json.financialTel;
     invoice.invoiceContent = json.invoiceContent;
     invoice.invoiceHead = json.invoiceHead;
     if (json.invoiceStatus===1){
          invoice.invoiceStatus = "申请中"
     }else if (json.invoiceStatus==2){
          invoice.invoiceStatus="申请完成"
     }
     invoice.invoiceType = json.invoiceType;
     invoice.note = json.note;
     invoice.receiveName = json.receiveName;
     invoice.receivePersonType = json.receivePersonType;
     invoice.receiveTel = json.receiveTel;
     if (json.receiveType=="0"){
          invoice.receiveType = "快递"
     } else if (json.receiveType=="1"){
          invoice.receiveType = "电子邮件"
     }

     invoice.receiveAddress = json.receiveAddress;
     invoice.taxpayersNumber = json.taxpayersNumber;
     invoice.orderId = json.orderId;
     invoice.applyTime = json.applyTime;
     invoice.orderPrice = json.orderPrice;
     return invoice;
}