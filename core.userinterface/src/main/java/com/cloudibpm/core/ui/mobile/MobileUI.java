package com.cloudibpm.core.ui.mobile;

public class MobileUI extends MobileUIComponent {

    private int selectBoardIndex = 0;

    public MobileUI() {
        setClasstypename("MobileUI");
    }

    public int getSelectBoardIndex() {
        return selectBoardIndex;
    }

    public void setSelectBoardIndex(int selectBoardIndex) {
        this.selectBoardIndex = selectBoardIndex;
    }
}
