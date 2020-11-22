package com.cloudibpm.core.ui.mobile.util.json;

import com.cloudibpm.core.ui.mobile.*;
import org.json.JSONArray;
import org.json.JSONObject;


public class MbUiJSONParser {
    public static MobileUI parseStrMbUI(String json) throws Exception {
        JSONObject obj = new JSONObject(json);
        return parseMbUI(obj);
    }

    public static MobileUI parseMbUI(JSONObject obj) throws Exception {
        MobileUI mobileUI = new MobileUI();
        parseCommonProps(mobileUI, obj);
        if (!obj.isNull("selectBoardIndex")) {
            mobileUI.setSelectBoardIndex(obj.getInt("selectBoardIndex"));
        }
        JSONArray jsonarr = obj.getJSONArray("children");
        if (jsonarr.length() > 0) { // parsing data variables and tasks
            for (int i = 0; i < jsonarr.length(); i++) {
                parseChildren(jsonarr.getJSONObject(i), mobileUI);
            }
        }
        return mobileUI;
    }

    private static void parseCommonProps(MobileUIComponent mobileUI, JSONObject obj) throws Exception {
        if (!obj.isNull("id")) {
            mobileUI.setId(obj.getString("id"));
        }
        if (!obj.isNull("name")) {
            mobileUI.setName(obj.getString("name"));
        }
        if (!obj.isNull("createDateTime")) {
            mobileUI.setCreateDateTime(obj.getLong("createDateTime"));
        }
        if (!obj.isNull("lastupdate")) {
            mobileUI.setLastupdate(obj.getLong("lastupdate"));
        }
        if (!obj.isNull("classtypename")) {
            mobileUI.setClasstypename(obj.getString("classtypename"));
        }
        if (!obj.isNull("parent")) {
            mobileUI.setParent(obj.getString("parent"));
        }
        if (!obj.isNull("currOwner")) {
            mobileUI.setCurrOwner(obj.getString("currOwner"));
        }
        if (!obj.isNull("owner")) {
            mobileUI.setOwner(obj.getString("owner"));
        }
    }

    private static void parseChildren(JSONObject obj, MobileUI mobileUI) throws Exception {
        MbBoard mbBoard = new MbBoard();
        parseCommonProps(mbBoard, obj);
        if (!obj.isNull("index")) {
            mbBoard.setIndex(obj.getInt("index"));
        }
        if (!obj.isNull("boardIcon")) {
            mbBoard.setBoardIcon(obj.getString("boardIcon"));
        }
        if (!obj.isNull("x0")) {
            mbBoard.setX0(obj.getDouble("x0"));
        }
        if (!obj.isNull("y0")) {
            mbBoard.setY0(obj.getDouble("y0"));
        }
        if (!obj.isNull("x1")) {
            mbBoard.setX1(obj.getDouble("x1"));
        }
        if (!obj.isNull("y1")) {
            mbBoard.setY1(obj.getDouble("y1"));
        }
        if (!obj.isNull("x10")) {
            mbBoard.setX10(obj.getDouble("x10"));
        }
        if (!obj.isNull("y10")) {
            mbBoard.setY10(obj.getDouble("y10"));
        }
        if (!obj.isNull("x11")) {
            mbBoard.setX11(obj.getDouble("x11"));
        }
        JSONArray jsonarr = obj.getJSONArray("children");
        if (jsonarr.length() > 0) { // parsing data variables and tasks
            for (int i = 0; i < jsonarr.length(); i++) {
                parseMbBoardChildren(jsonarr.getJSONObject(i), mbBoard);
            }
        }
        mobileUI.addOneChild(mbBoard);
    }

    private static void parseMbBoardChildren(JSONObject obj, MbBoard mbBoard) throws Exception {
        if (!obj.isNull("classtypename")) {
            String classname = obj.getString("classtypename");
            if (classname.equals("MbSearchBar")) {
                MbSearchBar bar = new MbSearchBar();
                parseCommonProps(bar, obj);
                parseMbSearchBar(obj, bar);
                mbBoard.addOneChild(bar);
            } else if (classname.equals("MbTopBar")) {
                MbTopBar bar = new MbTopBar();
                parseCommonProps(bar, obj);
                parseMbTopBar(obj, bar);
                mbBoard.addOneChild(bar);
            } else if (classname.equals("MbContentPanel")) {
                MbContentPanel mbContentPanel = new MbContentPanel();
                parseCommonProps(mbContentPanel, obj);
                if (!obj.isNull("x0")) {
                    mbContentPanel.setX0(obj.getDouble("x0"));
                }
                if (!obj.isNull("y0")) {
                    mbContentPanel.setY0(obj.getDouble("y0"));
                }
                if (!obj.isNull("x1")) {
                    mbContentPanel.setX1(obj.getDouble("x1"));
                }
                if (!obj.isNull("y1")) {
                    mbContentPanel.setY1(obj.getDouble("y1"));
                }
                if (!obj.isNull("selectedIndex")) {
                    mbContentPanel.setSelectedIndex(obj.getInt("selectedIndex"));
                }
                JSONArray jsonarr = obj.getJSONArray("children");
                if (jsonarr.length() > 0) { // parsing data variables and tasks
                    for (int i = 0; i < jsonarr.length(); i++) {
                        parseContentPanelChildren(jsonarr.getJSONObject(i), mbContentPanel);
                    }
                }
                mbBoard.addOneChild(mbContentPanel);
            }
        }
    }

    private static void parseMbSearchBar(JSONObject obj, MbSearchBar searchBar) throws Exception {
        if (!obj.isNull("x0")) {
            searchBar.setX0(obj.getDouble("x0"));
        }
        if (!obj.isNull("y0")) {
            searchBar.setY0(obj.getDouble("y0"));
        }
        if (!obj.isNull("x1")) {
            searchBar.setX1(obj.getDouble("x1"));
        }
        if (!obj.isNull("y1")) {
            searchBar.setY1(obj.getDouble("y1"));
        }
    }

    private static void parseMbTopBar(JSONObject obj, MbTopBar topBar) throws Exception {
        if (!obj.isNull("selectedIndex")) {
            topBar.setSelectedIndex(obj.getInt("selectedIndex"));
        }
        if (!obj.isNull("x0")) {
            topBar.setX0(obj.getDouble("x0"));
        }
        if (!obj.isNull("y0")) {
            topBar.setY0(obj.getDouble("y0"));
        }
        if (!obj.isNull("x1")) {
            topBar.setX1(obj.getDouble("x1"));
        }
        if (!obj.isNull("y1")) {
            topBar.setY1(obj.getDouble("y1"));
        }
        JSONArray jsonarr = obj.getJSONArray("children");
        if (jsonarr.length() > 0) { // parsing data variables and tasks
            for (int i = 0; i < jsonarr.length(); i++) {
                parseTopbarChildren(jsonarr.getJSONObject(i), topBar);
            }
        }
    }

    private static void parseTopbarChildren(JSONObject obj, MbTopBar topBar) throws Exception {
        MbTopBarItem mbTopBarItem = new MbTopBarItem();
        parseCommonProps(mbTopBarItem, obj);
        if (!obj.isNull("x0")) {
            mbTopBarItem.setX0(obj.getDouble("x0"));
        }
        if (!obj.isNull("y0")) {
            mbTopBarItem.setY0(obj.getDouble("y0"));
        }
        if (!obj.isNull("x1")) {
            mbTopBarItem.setX1(obj.getDouble("x1"));
        }
        if (!obj.isNull("y1")) {
            mbTopBarItem.setY1(obj.getDouble("y1"));
        }
        if (!obj.isNull("width")) {
            mbTopBarItem.setWidth(obj.getInt("width"));
        }
        if (!obj.isNull("height")) {
            mbTopBarItem.setHeight(obj.getInt("height"));
        }
        if (!obj.isNull("fontsize")) {
            mbTopBarItem.setFontsize(obj.getInt("fontsize"));
        }
        if (!obj.isNull("fontfamilty")) {
            mbTopBarItem.setFontfamilty(obj.getString("fontfamilty"));
        }
        if (!obj.isNull("children")) {
            parseTopbarItemChildren(obj.getJSONObject("children"), mbTopBarItem);
        }
        topBar.addOneChild(mbTopBarItem);
    }

    private static void parseTopbarItemChildren(JSONObject obj, MbTopBarItem mbTopBarItem) throws Exception {
        MbContentPanel mbContentPanel = new MbContentPanel();
        parseCommonProps(mbContentPanel, obj);
        if (!obj.isNull("x0")) {
            mbContentPanel.setX0(obj.getDouble("x0"));
        }
        if (!obj.isNull("y0")) {
            mbContentPanel.setY0(obj.getDouble("y0"));
        }
        if (!obj.isNull("x1")) {
            mbContentPanel.setX1(obj.getDouble("x1"));
        }
        if (!obj.isNull("y1")) {
            mbContentPanel.setY1(obj.getDouble("y1"));
        }
        if (!obj.isNull("selectedIndex")) {
            mbContentPanel.setSelectedIndex(obj.getInt("selectedIndex"));
        }
        JSONArray jsonarr = obj.getJSONArray("children");
        if (jsonarr.length() > 0) { // parsing data variables and tasks
            for (int i = 0; i < jsonarr.length(); i++) {
                parseContentPanelChildren(jsonarr.getJSONObject(i), mbContentPanel);
            }
        }
        mbTopBarItem.addOneChild(mbContentPanel);
    }


    private static void parseContentPanelChildren(JSONObject obj, MbContentPanel mbContentPanel) throws Exception {
        MbRow mbRow = new MbRow();
        parseCommonProps(mbRow, obj);
        if (!obj.isNull("x0")) {
            mbRow.setX0(obj.getDouble("x0"));
        }
        if (!obj.isNull("y0")) {
            mbRow.setY0(obj.getDouble("y0"));
        }
        if (!obj.isNull("x1")) {
            mbRow.setX1(obj.getDouble("x1"));
        }
        if (!obj.isNull("y1")) {
            mbRow.setY1(obj.getDouble("y1"));
        }
        // 不是column 是column number缩写
        if (!obj.isNull("colnum")) {
            mbRow.setColnum(obj.getInt("colnum"));
        }
        if (!obj.isNull("width")) {
            mbRow.setWidth(obj.getInt("width"));
        }
        if (!obj.isNull("height")) {
            mbRow.setHeight(obj.getInt("height"));
        }
        JSONArray jsonarr = obj.getJSONArray("children");
        if (jsonarr.length() > 0) { // parsing data variables and tasks
            for (int i = 0; i < jsonarr.length(); i++) {
                parseMbRowChildren(jsonarr.getJSONObject(i), mbRow);
            }
        }
        mbContentPanel.addOneChild(mbRow);
    }

    private static void parseMbRowChildren(JSONObject obj, MbRow mbRow) throws Exception {
        MbColumn mbColumn = new MbColumn();
        parseCommonProps(mbColumn, obj);
        if (!obj.isNull("x0")) {
            mbColumn.setX0(obj.getDouble("x0"));
        }
        if (!obj.isNull("y0")) {
            mbColumn.setY0(obj.getDouble("y0"));
        }
        if (!obj.isNull("x1")) {
            mbColumn.setX1(obj.getDouble("x1"));
        }
        if (!obj.isNull("y1")) {
            mbColumn.setY1(obj.getDouble("y1"));
        }
        if (!obj.isNull("width")) {
            mbColumn.setWidth(obj.getInt("width"));
        }
        if (!obj.isNull("height")) {
            mbColumn.setHeight(obj.getInt("height"));
        }
        JSONArray jsonarr = obj.getJSONArray("children");
        if (jsonarr.length() > 0) { // parsing data variables and tasks
            for (int i = 0; i < jsonarr.length(); i++) {
                parseMbColumnChildren(jsonarr.getJSONObject(i), mbColumn);
            }
        }
        mbRow.addOneChild(mbColumn);
    }

    private static void parseMbColumnChildren(JSONObject obj, MbColumn mbColumn) throws Exception {
        if (!obj.isNull("classtypename")) {
            String classname = obj.getString("classtypename");
            if (classname.equals("MbButton")) {
                MbButton button = new MbButton();
                parseCommonProps(button, obj);
                if (!obj.isNull("x0")) {
                    button.setX0(obj.getDouble("x0"));
                }
                if (!obj.isNull("y0")) {
                    button.setY0(obj.getDouble("y0"));
                }
                if (!obj.isNull("x1")) {
                    button.setX1(obj.getDouble("x1"));
                }
                if (!obj.isNull("y1")) {
                    button.setY1(obj.getDouble("y1"));
                }
                if (!obj.isNull("width")) {
                    button.setWidth(obj.getInt("width"));
                }
                if (!obj.isNull("height")) {
                    button.setHeight(obj.getInt("height"));
                }
                if (!obj.isNull("fontsize")) {
                    button.setFontsize(obj.getInt("fontsize"));
                }
                if (!obj.isNull("fontfamilty")) {
                    button.setFontfamilty(obj.getString("fontfamilty"));
                }
                if (!obj.isNull("clickMe")) {
                    button.setClickMe(obj.getInt("clickMe"));
                }
                if (!obj.isNull("clickMeOption")) {
                    button.setClickMeOption(obj.getInt("clickMeOption"));
                }
                if (!obj.isNull("clickMeUrl")) {
                    button.setClickMeUrl(obj.getString("clickMeUrl"));
                }
                if (!obj.isNull("alias")) {
                    button.setAlias(obj.getString("alias"));
                }
                if (!obj.isNull("longPressMe")) {
                    button.setLongPressMe(obj.getInt("longPressMe"));
                }
                if (!obj.isNull("longPressMeOption")) {
                    button.setLongPressMeOption(obj.getInt("longPressMeOption"));
                }
                if (!obj.isNull("longPressMeUrl")) {
                    button.setLongPressMeUrl(obj.getString("longPressMeUrl"));
                }
                if (!obj.isNull("fontWeight")) {
                    button.setFontWeight(obj.getString("fontWeight"));
                }
                if (!obj.isNull("frontgroundColor")) {
                    button.setFrontgroundColor(obj.getString("frontgroundColor"));
                }
                if (!obj.isNull("backgroundColor")) {
                    button.setBackgroundColor(obj.getString("backgroundColor"));
                }
                if (!obj.isNull("frontgroundIcon")) {
                    button.setFrontgroundIcon(obj.getString("frontgroundIcon"));
                }
                if (!obj.isNull("backgroundImage")) {
                    button.setBackgroundImage(obj.getString("backgroundImage"));
                }
                mbColumn.addOneChild(button);
            }
        }
    }

}
