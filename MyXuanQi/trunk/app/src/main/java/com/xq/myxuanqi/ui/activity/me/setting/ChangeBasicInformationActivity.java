package com.xq.myxuanqi.ui.activity.me.setting;

import android.arch.lifecycle.Observer;
import android.arch.lifecycle.ViewModelProviders;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.constraint.ConstraintLayout;
import android.support.constraint.ConstraintSet;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ScrollView;
import android.widget.TextView;

import com.cloudibpm.core.user.User;
import com.lljjcoder.Interface.OnCityItemClickListener;
import com.lljjcoder.bean.CityBean;
import com.lljjcoder.bean.DistrictBean;
import com.lljjcoder.bean.ProvinceBean;
import com.lljjcoder.citywheel.CityConfig;
import com.lljjcoder.style.citypickerview.CityPickerView;
import com.xq.myxuanqi.R;
import com.xq.myxuanqi.ui.activity.BaseActivity;
import com.xq.myxuanqi.util.SingleClick;
import com.xq.myxuanqi.util.SpUtil;
import com.xq.myxuanqi.viewModel.BasicInformationViewModel;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import cn.qqtheme.framework.picker.DatePicker;
import cn.qqtheme.framework.picker.OptionPicker;

public class ChangeBasicInformationActivity extends BaseActivity {

    @BindView(R.id.et_name)
    EditText         mEtName;
    @BindView(R.id.et_sex)
    TextView         mEtSex;
    @BindView(R.id.et_birthday)
    TextView         mEtBirthday;
    @BindView(R.id.et_height)
    EditText         mEtHeight;
    @BindView(R.id.et_weight)
    EditText         mEtWeight;
    @BindView(R.id.et_blood)
    TextView         mEtBlood;
    @BindView(R.id.et_national)
    TextView         mEtNational;
    @BindView(R.id.et_location)
    TextView         mEtLocation;
    @BindView(R.id.et_address)
    TextView         mEtAddress;
    @BindView(R.id.et_postcode)
    EditText         mEtPostcode;
    @BindView(R.id.et_email)
    EditText         mEtEmail;
    @BindView(R.id.sv)
    ScrollView       mSv;
    @BindView(R.id.tb)
    Toolbar          mTb;
    @BindView(R.id.cl)
    ConstraintLayout mCl;
    @BindView(R.id.cl_setting_email)
    ConstraintLayout mClSettingEmail;
    @BindView(R.id.et_used_name)
    EditText         mEtUsedName;
    private BasicInformationViewModel mBasicInformationViewModel;
    private CityPickerView mCityPickerView = new CityPickerView();
    private User           mUser           = new User();
    private SimpleDateFormat mDateFormat;

    @Override
    public void init() {
        super.init();
        View decorView = getWindow().getDecorView();
        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
        } else {
            ConstraintSet constraintSet = new ConstraintSet();
            constraintSet.clone(mCl);
            constraintSet.connect(mTb.getId(), ConstraintSet.TOP, mCl.getId(), ConstraintSet.TOP, 20);
            constraintSet.applyTo(mCl);
            //            mTb.setPadding(0,200,0,10);
        }
        mCityPickerView.init(this);
        mBasicInformationViewModel = ViewModelProviders.of(this)
                .get(BasicInformationViewModel.class);
        User user2 = SpUtil.getInstance().getLogin().getUser();
        mBasicInformationViewModel.setUser(user2);
        mBasicInformationViewModel.getUser().observe(this, new Observer<User>() {
            @Override
            public void onChanged(@Nullable User user) {
                mEtName.setText(user.getFullName() + "");
                if (user.getGender().equals("M")) {
                    mEtSex.setText("男");
                } else if (user.getGender().equals("F")) {
                    mEtSex.setText("女");
                }
                mDateFormat = new SimpleDateFormat("yyyy-MM-dd");
                String birthday = "";
                if (user.getBirthday() == null) {
                } else {
                    birthday = mDateFormat.format(user.getBirthday());
                }
                mEtBirthday.setText(birthday + "");
                mEtHeight.setText(user.getHeight() + "");
                mEtWeight.setText(user.getWeight() + "");
                mEtBlood.setText(user.getBloodType() + "");
                mEtPostcode.setText(user.getPostcode() + "");
                mEtEmail.setText(user.getEmail() + "");
                mEtNational.setText(user.getNation() + "");
                mEtLocation.setText(user.getProvince() + "-" + user.getCity()
                        + "-" + user.getCounty());
                mEtAddress.setText(user.getAddress() + "");
                mEtUsedName.setText(user.getUsedName()+"");
                mUser.setId(user.getId());
                mUser.setIdType(user.getIdType());
                mUser.setIdNumber(user.getIdNumber());
                mUser.setMobile(user.getMobile());
                mUser.setLastupdate(user.getLastupdate());
                mUser.setUsedName(user.getUsedName());
                mUser.setHouseholdAddress(user.getHouseholdAddress());
                mUser.setHouseholdPostcode(user.getHouseholdPostcode());
            }
        });

    }

    @Override
    protected int getLayoutResId() {
        return R.layout.activity_change_basic_information;
    }
    @SingleClick
    @OnClick({R.id.tb_back, R.id.cl_setting_name, R.id.cl_setting_sex,
            R.id.cl_setting_birthday, R.id.cl_setting_height, R.id.cl_setting_weight,
            R.id.cl_setting_blood, R.id.cl_setting_national, R.id.cl_setting_location,
            R.id.cl_setting_address, R.id.cl_setting_postcode, R.id.cl_setting_email, R.id.cl_setting_used_name})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tb_back:
                //上传修改数据
                uploadBasicInformation();
                break;
            case R.id.cl_setting_name:
                mEtName.setFocusableInTouchMode(true);
                mEtName.setFocusable(true);
                mEtName.requestFocus();
                InputMethodManager imm = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm.showSoftInput(mEtName, InputMethodManager.SHOW_IMPLICIT);
                break;
            case R.id.cl_setting_sex:
                String[] items = new String[]{"男", "女"};
                OptionPicker optionPicker = new OptionPicker(ChangeBasicInformationActivity.this, items);
                optionPicker.setOnOptionPickListener(new OptionPicker.OnOptionPickListener() {
                    @Override
                    public void onOptionPicked(int index, String item) {
                        mEtSex.setText(item);
                    }
                });
                optionPicker.setCancelText("取消");
                optionPicker.setSubmitText("确定");
                optionPicker.show();
                break;
            case R.id.cl_setting_birthday:
                //年月日
                DatePicker datePicker = new DatePicker(ChangeBasicInformationActivity.this, 0);
                datePicker.setRange(1898, Calendar.getInstance().get(Calendar.YEAR));
                datePicker.setCancelText("取消");
                datePicker.setSubmitText("确定");
                datePicker.setOnDatePickListener(new DatePicker.OnYearMonthDayPickListener() {
                    @Override
                    public void onDatePicked(String year, String month, String day) {
                        mEtBirthday.setText(year + "-" + month + "-" + day);
                    }
                });
                datePicker.show();
                break;
            case R.id.cl_setting_height:
                mEtHeight.setFocusableInTouchMode(true);
                mEtHeight.setFocusable(true);
                mEtHeight.requestFocus();
                InputMethodManager imm1 = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm1.showSoftInput(mEtHeight, InputMethodManager.SHOW_IMPLICIT);
                break;
            case R.id.cl_setting_weight:
                mEtWeight.setFocusableInTouchMode(true);
                mEtWeight.setFocusable(true);
                mEtWeight.requestFocus();
                InputMethodManager imm2 = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm2.showSoftInput(mEtWeight, InputMethodManager.SHOW_IMPLICIT);
                break;
            case R.id.cl_setting_blood:
                String[] items1 = new String[]{"A", "B", "AB", "O", "Rh阴性", "Rh阳性"};
                OptionPicker optionPicker1 = new OptionPicker(ChangeBasicInformationActivity.this, items1);
                optionPicker1.setOnOptionPickListener(new OptionPicker.OnOptionPickListener() {
                    @Override
                    public void onOptionPicked(int index, String item) {
                        mEtBlood.setText(item);
                    }
                });
                optionPicker1.setCancelText("取消");
                optionPicker1.setSubmitText("确定");
                optionPicker1.show();
                break;
            case R.id.cl_setting_national:
                String[] items2 = new String[]{"汉族", "回族", "满族", "蒙古族", "壮族", "彝族",
                        "白族", "藏族", "傣族", "佤族", "侗族", "哈尼族", "苗族", "拉祜族", "纳西族",
                        "景颇族", "水族", "怒族", "僳僳族", "独龙族", "布朗族", "基诺族", "羌族",
                        "门巴族", "德昂族", "阿昌族", "普米族", "布依族", "珞巴族", "仡佬族", "东乡族",
                        "撒拉族", "保安族", "维吾尔族", "土族", "裕固族", "锡伯族", "俄罗斯族",
                        "塔塔尔族", "哈萨克族", "柯尔克孜族", "塔吉克族", "乌孜别克族", "高山族",
                        "畲族", "黎族", "瑶族", "京族", "仫佬族", "毛南族", "土家族", "朝鲜族",
                        "赫哲族", "达斡尔族", "鄂温克族", "鄂伦春族"};
                OptionPicker optionPicker2 = new OptionPicker(ChangeBasicInformationActivity.this, items2);
                optionPicker2.setOnOptionPickListener(new OptionPicker.OnOptionPickListener() {
                    @Override
                    public void onOptionPicked(int index, String item) {
                        mEtNational.setText(item);
                    }
                });
                optionPicker2.setCancelText("取消");
                optionPicker2.setSubmitText("确定");
                optionPicker2.show();
                break;
            case R.id.cl_setting_location:
                CityConfig cityConfig = new CityConfig.Builder().build();
                cityConfig.setDefaultProvinceName("北京市");//默认显示的省份
                cityConfig.setProvinceCyclic(false);//滚轮是否循环滚动
                cityConfig.setDefaultCityName("北京市");//默认显示的城市
                cityConfig.setCityCyclic(false);
                cityConfig.setDefaultDistrict("朝阳区");//默认显示的区
                cityConfig.setDistrictCyclic(false);
                cityConfig.setLineColor("#FF94E2FF");
                cityConfig.setTitleTextColorStr("#FF5CBEFF");
                cityConfig.setCancelTextColorStr("#FF5CBEFF");
                cityConfig.setConfirmTextColorStr("#FF5CBEFF");
                mCityPickerView.setConfig(cityConfig);
                mCityPickerView.setOnCityItemClickListener(new OnCityItemClickListener() {
                    @Override
                    public void onSelected(ProvinceBean province, CityBean city, DistrictBean district) {
                        super.onSelected(province, city, district);
                        mEtLocation.setText(province.getName() + "-" + city.getName() + "-" + district.getName());
                        mEtPostcode.setText(district.getId());
                    }
                });
                mCityPickerView.showCityPicker();
                break;
            case R.id.cl_setting_address:
                mEtAddress.setFocusableInTouchMode(true);
                mEtAddress.setFocusable(true);
                mEtAddress.requestFocus();
                InputMethodManager imm3 = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm3.showSoftInput(mEtAddress, InputMethodManager.SHOW_IMPLICIT);
                break;
            case R.id.cl_setting_postcode:
                mEtPostcode.setFocusableInTouchMode(true);
                mEtPostcode.setFocusable(true);
                mEtPostcode.requestFocus();
                InputMethodManager imm6 = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm6.showSoftInput(mEtPostcode, InputMethodManager.SHOW_IMPLICIT);
                break;
            case R.id.cl_setting_email:
                mEtEmail.setFocusableInTouchMode(true);
                mEtEmail.setFocusable(true);
                mEtEmail.requestFocus();
                InputMethodManager imm4 = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm4.showSoftInput(mEtEmail, InputMethodManager.SHOW_IMPLICIT);
                break;
            case R.id.cl_setting_used_name:
                mEtUsedName.setFocusableInTouchMode(true);
                mEtUsedName.setFocusable(true);
                mEtUsedName.requestFocus();
                InputMethodManager imm5 = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                imm5.showSoftInput(mEtUsedName, InputMethodManager.SHOW_IMPLICIT);
                break;
        }
    }

    private void uploadBasicInformation() {
        String name = mEtName.getText().toString().trim();
        if (!TextUtils.isEmpty(name)) {  //修改姓名
            if (name.length() > 1) {
                mUser.setSurname(name.substring(0, 1));
                mUser.setGivenname(name.substring(1));
            } else {
                mUser.setSurname(name);
            }
        }
        String sex = mEtSex.getText().toString().trim();
        if (sex.equals("男")) {   //修改性别
            mUser.setGender("M");
        } else {
            mUser.setGender("F");
        }
        String birthday = mEtBirthday.getText().toString().trim();
        Date birthdayDate = null;//修改生日
        int age = 0;
        try {
            birthdayDate = mDateFormat.parse(birthday);
            age = getAge(birthdayDate); //修改年龄
        } catch (Exception e) {
            e.printStackTrace();
        }

        mUser.setAge(age);
        mUser.setBirthday(birthdayDate);
        String height = mEtHeight.getText().toString().trim();//修改身高
        mUser.setHeight(Integer.valueOf(height));
        String weight = mEtWeight.getText().toString().trim();//修改体重
        mUser.setWeight(Integer.valueOf(weight));
        String blood = mEtBlood.getText().toString().trim();//修改血型
        mUser.setBloodType(blood);
        String nation = mEtNational.getText().toString().trim();//修改民族
        mUser.setNation(nation);
        String location = mEtLocation.getText().toString().trim();
        if (!location.equals("--")) {
            String[] split = location.split("-");
            String province = split[0];
            String city = split[1];
            String county = split[2];
            mUser.setCountry("中国");
            mUser.setProvince(province);//修改省市区
            mUser.setCity(city);
            mUser.setCounty(county);
        }
        String address = mEtAddress.getText().toString().trim();//修改详细地址
        mUser.setAddress(address);
        String postCode = mEtPostcode.getText().toString().trim();//修改邮编
        mUser.setPostcode(postCode);
        String email = mEtEmail.getText().toString().trim();
        mUser.setEmail(email);
        String usedName = mEtUsedName.getText().toString().trim();
        mUser.setUsedName(usedName);
        mBasicInformationViewModel.uploadBasicInformation(mUser);
        //返回页面
        finish();
    }

    /*
    * 对返回键逻辑做处理
    * */
    @Override
    public void onBackPressed() {
        uploadBasicInformation();
    }

    /*
        * 根据生日获取年龄
        * */
    private int getAge(Date birthDay) throws Exception {
        Calendar cal = Calendar.getInstance();
        if (cal.before(birthDay)) {
            throw new IllegalArgumentException("The birthDay is before Now.It's unbelievable!");
        }
        int yearNow = cal.get(Calendar.YEAR);
        int monthNow = cal.get(Calendar.MONTH);
        int dayOfMonthNow = cal.get(Calendar.DAY_OF_MONTH);
        cal.setTime(birthDay);
        int yearBirth = cal.get(Calendar.YEAR);
        int monthBirth = cal.get(Calendar.MONTH);
        int dayOfMonthBirth = cal.get(Calendar.DAY_OF_MONTH);
        int age = yearNow - yearBirth;
        if (monthNow <= monthBirth) {
            if (monthNow == monthBirth) {
                if (dayOfMonthNow < dayOfMonthBirth)
                    age--;
            } else {
                age--;
            }
        }
        return age;
    }

}
