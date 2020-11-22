package com.cloudibpm.controller;

import com.cloudibpm.blo.runtime.server.BpmServerBlo;
import com.cloudibpm.blo.runtime.server.BpmServerGroupBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.folder.JSTreeNode;
import com.cloudibpm.core.runtime.server.ServerGroupInfoDescriptor;
import com.cloudibpm.core.runtime.server.ServerInfoDescriptor;
import com.cloudibpm.core.websocketmodel.WebSocketMessage;
import com.model.WebSocketEntityContainer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/service12")
public class BpmServerController {
    private final BpmServerGroupBlo bpmServerGroupBlo;
    private final BpmServerBlo bpmServerBlo;
    private final WebSocketEntityContainer webSocketEntityContainer;

    @Autowired
    public BpmServerController(BpmServerGroupBlo bpmServerGroupBlo, BpmServerBlo bpmServerBlo, WebSocketEntityContainer webSocketEntityContainer) {
        this.bpmServerGroupBlo = bpmServerGroupBlo;
        this.bpmServerBlo = bpmServerBlo;
        this.webSocketEntityContainer = webSocketEntityContainer;
    }

    @RequestMapping(value = "/api0", method = RequestMethod.POST, headers = "Accept=application/json")
    @ResponseBody
    public JSTreeNode[] getServerGroups() {
        try {
            List<ServerGroupInfoDescriptor> groups = bpmServerGroupBlo.getAllServers();
            for (ServerGroupInfoDescriptor group : groups) {
                List<ServerInfoDescriptor> list = bpmServerBlo.getAllServersInGroup(group.getId());
                group.append(list.toArray(new ServerInfoDescriptor[list.size()]));
            }
            return generateJSTreeNodes(groups.toArray(new ServerGroupInfoDescriptor[groups.size()]));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @PostMapping("/api1")
    public boolean sendMessage(String userId, String count) throws IOException {
        WebSocketMessage webSocketMessage = new WebSocketMessage();
        webSocketMessage.setMessageType("5");
        if (userId.indexOf("#") > 0) {
            String[] userids = userId.split("#");
            if (userids != null && userids.length > 0) {
                for (int i = 0; i < userids.length; i++) {
                    String[] t = userids[i].split("@");
                    webSocketMessage.setMessageData("{\"count\":\"" + count + "\", \"priority\":\"" + t[1] + "\", \"tid\":\"" + t[2] + "\"}");
                    webSocketEntityContainer.sendMsgToUser(t[0], webSocketMessage);
                }
            }
        } else {
            String[] t = userId.split("@");
            webSocketMessage.setMessageData("{\"count\":\"" + count + "\", \"priority\":\"" + t[1] + "\", \"tid\":\"" + t[2] + "\"}");
            webSocketEntityContainer.sendMsgToUser(t[0], webSocketMessage);
        }
        return true;
    }

    private JSTreeNode[] generateJSTreeNodes(TreeNode[] roots) {
        if (roots.length > 0) {
            JSTreeNode[] jstnodes = new JSTreeNode[roots.length];
            for (int i = 0; i < roots.length; i++) {
                TreeNode node = roots[i];
                JSTreeNode jstnode = new JSTreeNode();
                jstnode.id = node.getId();
                jstnode.text = JSTreeNode.parseUTF8(node.getName());
                jstnode.icon = "glyphicon glyphicon-home";
                jstnode.data = "";
                if (node instanceof ServerGroupInfoDescriptor) {
                    jstnode.icon = "glyphicon glyphicon-folder-open";
                    // add some spare information
                    jstnode.data = "1|null";
                } else if (node instanceof ServerInfoDescriptor) {
                    jstnode.icon = "glyphicon glyphicon-tasks";
                    // add some spare information
                    jstnode.data = "2|" + ((ServerInfoDescriptor) node).getIpv4();
                }
                if (node.getParent() != null) {
                    jstnode.parentId = node.getParent();
                }
                if (node.hasChildren()) {
                    jstnode.children = generateJSTreeNodes(node.getChildren());
                }
                jstnodes[i] = jstnode;
            }
            return jstnodes;
        }
        return null;
    }

}
