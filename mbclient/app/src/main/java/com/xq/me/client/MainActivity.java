package com.xq.me.client;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import static com.xq.me.client.R.menu.main_menu;

import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;

// Android开发：顶部&底部Tab导航栏实现（TabLayout+ViewPager+Fragment）
// http://www.jianshu.com/p/ce1d060573ba

// Android Studio初步使用及HelloWorld详解
// https://www.zybuluo.com/stepbystep/note/63311

// Android的onCreateOptionsMenu()创建菜单Menu详解:
// http://www.cnblogs.com/spring87/p/4312538.html

// [Android开发]- MVC的架构实现登录模块-3
// http://www.jianshu.com/p/2876eadbe457

// Android程序签名详解、打包、发布到Google play步骤
// http://blog.csdn.net/liwei3gjob/article/details/7937418
public class MainActivity extends AppCompatActivity {

    private TabLayout mTabLayout;
    private ViewPager mViewPager;
    private MyFragmentPagerAdapter myFragmentPagerAdapter;

    private TabLayout.Tab one;
    private TabLayout.Tab two;
    private TabLayout.Tab three;
    private TabLayout.Tab four;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //getSupportActionBar().hide();//隐藏掉整个ActionBar

        setContentView(R.layout.activity_main);

        //初始化视图
        initViews();

    }

    private void initViews() {

        //使用适配器将ViewPager与Fragment绑定在一起
        mViewPager= (ViewPager) findViewById(R.id.viewPager);
        myFragmentPagerAdapter = new MyFragmentPagerAdapter(getSupportFragmentManager());
        mViewPager.setAdapter(myFragmentPagerAdapter);

        //将TabLayout与ViewPager绑定在一起
        mTabLayout = (TabLayout) findViewById(R.id.tabLayout);
        mTabLayout.setupWithViewPager(mViewPager);

        //指定Tab的位置
        one = mTabLayout.getTabAt(0);
        two = mTabLayout.getTabAt(1);
        three = mTabLayout.getTabAt(2);
        four = mTabLayout.getTabAt(3);

        //设置Tab的图标，假如不需要则把下面的代码删去
        one.setIcon(R.mipmap.ic_launcher);
        two.setIcon(R.mipmap.ic_launcher);
        three.setIcon(R.mipmap.ic_launcher);
        four.setIcon(R.mipmap.ic_launcher);


    }



    public boolean onCreateOptionsMenu(Menu menu)
    {
        //新建的xml文件
        getMenuInflater().inflate(main_menu, menu);
        return super.onCreateOptionsMenu(menu);
    }

    public boolean onOptionsItemSelected(MenuItem item)
    {
        //根据不同的id点击不同按钮控制activity需要做的事件
        switch (item.getItemId())
        {
            case R.id.id_action_setting:
                //事件
                break;
        }
        return  super.onOptionsItemSelected(item);
    }
}

