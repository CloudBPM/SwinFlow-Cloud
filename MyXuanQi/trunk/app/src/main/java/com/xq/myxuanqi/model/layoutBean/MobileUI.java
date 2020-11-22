package com.xq.myxuanqi.model.layoutBean;

import android.support.annotation.NonNull;
import android.support.design.widget.BottomNavigationView;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.view.ViewPager;
import android.view.MenuItem;

import com.xq.myxuanqi.R;
import com.xq.myxuanqi.adapter.HomeViewPagerAdapter;
import com.xq.myxuanqi.ui.fragment.AddressFragment;
import com.xq.myxuanqi.ui.fragment.CommunicationFragment;
import com.xq.myxuanqi.ui.fragment.HomeFragment;
import com.xq.myxuanqi.ui.fragment.MeFragment;
import com.xq.myxuanqi.ui.fragment.NewsFragment;
import com.xq.myxuanqi.ui.fragment.VideoFragment;
import com.xq.myxuanqi.util.BottomNavigationViewHelper;

import java.util.ArrayList;
import java.util.List;

public class MobileUI extends MobileUIComponent {

    private int selectBoardIndex = 0;
    private onSelectCallBack mOnSelectCallBack;
    private HomeViewPagerAdapter mViewPagerAdapter;

    public interface onSelectCallBack{
        void onSelectListener(int i);
    }

    public void setOnSelectCallBack(onSelectCallBack onSelectCallBack){
        this.mOnSelectCallBack = onSelectCallBack;
    }

    public MobileUI() {
        setClasstypename("MobileUI");
    }

    public int getSelectBoardIndex() {
        return selectBoardIndex;
    }

    public void setSelectBoardIndex(int selectBoardIndex) {
        this.selectBoardIndex = selectBoardIndex;
    }

    public int getMbBoardNumber() {
        return getChildren().length;
    }

    public MbBoard getMbBoard(int i) {
        return (MbBoard) getChildren()[i];
    }

    public void toAndroidUI(int mbBoardNumber, BottomNavigationView mNavigation, List<Fragment> mList, FragmentManager fm, ViewPager mVp, List<MenuItem> list1){
       //动态生成底部菜单
        //产生对应的fragment
                MbBoard mbBoard = getMbBoard(0);
                String name = mbBoard.getName();
                MenuItem item = mNavigation.getMenu().add(1, 0, 0, name);
                //设置菜单图片
                item.setIcon(R.drawable.ic_home);
                list1.add(item);
                mList.add(new HomeFragment(0));
        mViewPagerAdapter.notifyDataSetChanged();
        ///storage/emulated/0/Android/data/com.xq.myxuanqi/ICON_00000000000001aO.png
        /*item.setIcon(Drawable.createFromPath(new File(Environment.getExternalStorageDirectory().getAbsolutePath() + File.separator + "Android"
                +File.separator+"data"+File.separator+"com.xq.myxuanqi" , "ICON_00000000000001aO.png").getAbsolutePath()));*/
    }

    //底部菜单栏的选择监听
    private BottomNavigationView.OnNavigationItemSelectedListener mOnNavigationItemSelectedListener
            = new BottomNavigationView.OnNavigationItemSelectedListener() {

        @Override
        public boolean onNavigationItemSelected(@NonNull MenuItem item) {
                    //设置监听回调
                    mOnSelectCallBack.onSelectListener(item.getItemId());
                    return true;
        }
    };
}
