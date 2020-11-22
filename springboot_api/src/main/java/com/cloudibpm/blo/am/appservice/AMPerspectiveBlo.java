/**
 * @user Dahai CAO
 * @date 2011-11-1 下午10:20:49
 */
package com.cloudibpm.blo.am.appservice;

import com.cloudibpm.blo.am.androidapp.AndroidAppMsPluginBlo;
import com.cloudibpm.blo.am.container.ServiceContainerBlo;
import com.cloudibpm.blo.am.template.EmailTemplateBlo;
import com.cloudibpm.blo.am.template.SMSTemplateBlo;
import com.cloudibpm.blo.folder.WfFolderBlo;
import com.cloudibpm.blo.om.organization.OrganizationBlo;
import com.cloudibpm.core.TreeNode;
import com.cloudibpm.core.appservice.AndroidAppPlugin;
import com.cloudibpm.core.appservice.WebAppService;
import com.cloudibpm.core.container.ContainerType;
import com.cloudibpm.core.container.ServiceContainer;
import com.cloudibpm.core.folder.Folder;
import com.cloudibpm.core.folder.FolderType;
import com.cloudibpm.core.organization.Organization;
import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.core.template.EmailTemplate;
import com.cloudibpm.core.template.SMSTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
//@Transactional
public class AMPerspectiveBlo extends BusinessLogicObject {
    private final OrganizationBlo organizationBlo;
    private final WebAppServiceBlo webAppServiceBlo;
    private final WfFolderBlo wfFolderBlo;
    private final SMSTemplateBlo smsTemplateBlo;
    private final EmailTemplateBlo emailTemplateBlo;
    private final ServiceContainerBlo serviceContainerBlo;
    private final AndroidAppMsPluginBlo androidAppMsPluginBlo;

    @Autowired
    public AMPerspectiveBlo(OrganizationBlo organizationBlo,
                            WebAppServiceBlo webAppServiceBlo,
                            WfFolderBlo wfFolderBlo,
                            SMSTemplateBlo smsTemplateBlo,
                            EmailTemplateBlo emailTemplateBlo,
                            ServiceContainerBlo serviceContainerBlo,
                            AndroidAppMsPluginBlo androidAppMsPluginBlo) {
        this.organizationBlo = organizationBlo;
        this.webAppServiceBlo = webAppServiceBlo;
        this.wfFolderBlo = wfFolderBlo;
        this.smsTemplateBlo = smsTemplateBlo;
        this.emailTemplateBlo = emailTemplateBlo;
        this.serviceContainerBlo = serviceContainerBlo;
        this.androidAppMsPluginBlo = androidAppMsPluginBlo;
    }

    /**
     * Gets all organizations for tool agent explorer tree in agent perspective.
     * These organizations include all agent folders that may contain tool
     * agents. And the tool agents are in the folders.
     *
     * @return
     * @throws Exception
     * @date 2011-11-1 下午10:22:40
     */
    public List<Organization> getOrganizationsForAgentViewer() throws Exception {
        List<Organization> orgs = this.organizationBlo.getOrganizations();
        for (Organization org : orgs) {
            int[] types = {Folder.SMS_SENDING_TEMPLATE_FOLDER, Folder.EMAIL_SENDING_TEMPLATE_FOLDER,
                    Folder.CONTAINER_FOLDER, Folder.WEB_SERVICE_FOLDER, Folder.DOCKER_FOLDER, FolderType.MOBILE_APP_FOLDER};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
            for (TreeNode child : org.getChildren()) {
                getLeafNode(child);
            }
        }
        return orgs;
    }

    public List<Organization> getOrganizationsForAgentViewer(String[] strArry) throws Exception {
        List<Organization> orgs = this.organizationBlo.getOrganizationsByIds(strArry);
        for (Organization org : orgs) {
            int[] types = {Folder.SMS_SENDING_TEMPLATE_FOLDER, Folder.EMAIL_SENDING_TEMPLATE_FOLDER,
                    Folder.CONTAINER_FOLDER, Folder.WEB_SERVICE_FOLDER, Folder.DOCKER_FOLDER, FolderType.MOBILE_APP_FOLDER};
            wfFolderBlo.getChildrenFoldersForOrgViewer(org, types);
            for (TreeNode child : org.getChildren()) {
                getLeafNode(child);
            }
        }
        return orgs;
    }

    /**
     * @param parent
     * @throws Exception
     * @date 2011-11-1 下午10:22:46
     */
    private void getLeafNode(TreeNode parent) throws Exception {
        Folder f = (Folder) parent;
        if (f.getType() == Folder.SMS_SENDING_TEMPLATE_FOLDER) {
            // SMS template folder
            for (SMSTemplate template : smsTemplateBlo.getTemplates(parent.getOwner())) {
                parent.addChild(template);
            }
        } else if (f.getType() == Folder.EMAIL_SENDING_TEMPLATE_FOLDER) {
            // email template folder
            for (EmailTemplate template : emailTemplateBlo.getTemplates(parent.getOwner())) {
                parent.addChild(template);
            }
        } else if (f.getType() == Folder.DOCKER_FOLDER) {
            // docker container folder
            List<ServiceContainer> list = serviceContainerBlo.findAll(parent.getOwner());
            if (!list.isEmpty()) {
                for (int i = 0; i < list.size(); i++) {
                    ServiceContainer sc = list.get(i);
                    parent.addChild(sc);
                    // docker based java application micro-service
                    if (sc.getContainerType() == ContainerType.JSP_SERVLET_CONTAINER
                            || sc.getContainerType() == ContainerType.PHP_CONTAINER
                            || sc.getContainerType() == ContainerType.PYTHON_CONTAINER
                            || sc.getContainerType() == ContainerType.RUBY_CONTAINER) {
                        // docker-based jsp or servlet micro-service
                        // docker-based php applications micro-service
                        // docker-based python applications micro-service
                        // docker-based ruby applications micro-service
                        for (WebAppService ras : webAppServiceBlo.getWebAppServices(sc.getId())) {
                            sc.addChild(ras);
                        }
                    }
                }
            }
        } else if (f.getType() == Folder.WEB_SERVICE_FOLDER) {
            // general micro-service
            for (WebAppService ras : webAppServiceBlo.getWebAppServices(parent.getId())) {
                parent.addChild(ras);
            }
        } else if (f.getType() == FolderType.MOBILE_APP_FOLDER) {
            // Andriod app micro-service plugin
            for (AndroidAppPlugin plugin : androidAppMsPluginBlo.getAndroidPlugins(parent.getId())) {
                parent.addChild(plugin);
            }
        }
    }

}
