/**
 *
 */
package com.cloudibpm.core.folder;

/**
 * @author Dahai Cao created at 15:32 on 2018-10-31
 *
 */
public interface FolderType {
    /**
     * Process root folder type. This root folder contains all process
     * sub-folder and all processes in this organisation.
     */
    int PROCESS_FOLDER = 100;
    /**
     * Calendar root folder type. This root folder contains all calendars
     * defined by user.
     */
    int CALENDAR_FOLDER = 101;
    /**
     * Group root folder type. This root folder contains all authority groups.
     */
    int GROUP_FOLDER = 102;
    /**
     * User root folder type. This root folder contains all users in this
     * organisation.
     */
    int USER_FOLDER = 103;
    /**
     * Basic data root folder type. This root folder contains all basic data and
     * forms.
     */
    int BASIC_DATA_FOLDER = 104;
    /**
     * Reference data root folder type. This root folder contains all reference
     * data in this organization.
     */
    int REFERENCE_DATA_FOLDER = 105;
    /**
     * Form root folder type. This root folder contains all the forms defined by
     * users.
     */
    int FORM_FOLDER = 106;
    /**
     * Organisation structure root folder type. This root folder contains all
     * organisation elements such as departments, project teams, positions, etc.
     */
    int STRUCTURE_FOLDER = 107;
    /**
     * Tool agent package folder type. This folder contains tool agents.
     */
    //  int TOOLAGENT_FOLDER = 108;
    /**
     * Released process folder type. This folder contains all released
     * processes.
     */
    int RELEASED_PROCESS_FOLDER = 109;
    /**
     * sms sending template folder type. This folder contains all sms sending
     * templates.
     */
    int SMS_SENDING_TEMPLATE_FOLDER = 110;
    // /**
    // * sms sending log folder type. This folder contains all sms sending logs.
    // */
    //  int SMS_SENDING_LOG_FOLDER = 111;
    // /**
    // * sms sending log folder type. This folder contains all sms sending logs.
    // */
    //  int SMS_RECEIVING_LOG_FOLDER = 112;
    /**
     * email sending template folder type. This folder contains all email
     * sending templates.
     */
    int EMAIL_SENDING_TEMPLATE_FOLDER = 113;
    /**
     * email sending log folder type. This folder contains all email sending
     * logs.
     */
    int NEWS_APPROVAL_FOLDER = 114;
    /**
     * Organization approval folder type.
     */
    int ORG_APPROVAL_FOLDER = 115;
    /**
     * Service container folder type. This folder contains multiple services.
     */
    int CONTAINER_FOLDER = 116;
    /**
     * RESTFul service API folder type. This folder contains RESTFul service
     * APIs for cloud BPM.
     */
    int WEB_SERVICE_FOLDER = 117;
    /**
     * Released folder type.
     */
    int RELEASED_FORM_FOLDER = 118;
    /**
     * Home page folder type.
     */
    int HOMEPABGE_FOLDER = 119;
    /**
     * License management folder type.
     */
    int LICENSE_FOLDER = 120;
    /**
     * File management folder type.
     */
    int FILE_FOLDER = 121;
    /**
     * Payment account folder type.
     */
    int PAYMENT_FOLDER = 122;
    /**
     * This folder is a menu. It means an approval before an application will be
     * released to service market.
     */
    int APP_APPROVAL_FOLDER = 123;
    /**
     * This folder is a menu. It means an approval before a form will be
     * released to service market.
     */
    int FORM_APPROVAL_FOLDER = 124;
    /**
     * This folder is a menu. It means the micro-service approval before it will
     * be released to service market.
     */
    int MS_APPROVAL_FOLDER = 125;
    /**
     * This folder is a menu. It can be used to open an editor for publishing a
     * news.
     */
    int NEWS_FOLDER = 126;
    /**
     * This folder is a menu. It can be used to open an editor for publishing a
     * notice.
     */
    int NOTICE_FOLDER = 127;
    /**
     * This folder is a menu. It can be used to open an editor for sending a
     * reminder to a user.
     */
    int MOBILE_APP_APPROVAL_FOLDER = 128;
    /**
     * Docker container platform type. This folder contains docker service
     * container.
     */
    int DOCKER_FOLDER = 129;
    /**
     * System approval type. This folder contains some sub folders for many
     * types of approvals.
     */
    int APPROVAL_FOLDER = 130;
    /**
     * Community folder type. This folder contains some sub folders for forums,
     * channels, columns, etc.
     */
    int COMMUNITY_FOLDER = 131;
    /**
     * Help type. This folder contains some sub folders for help/FAQ.
     */
    int HELP_FOLDER = 132;
    /**
     * Help type. This folder contains some sub folders for help/FAQ.
     */
    int CUSTOMER_SERVICE_FOLDER = 133;
    /**
     * Organization category folder type.
     */
    int CATEGORY_FOLDER = 134;
    /**
     * Organization category folder type.
     */
    int ORG_CATEGORY_FOLDER = 135;
    /**
     * Organization category folder type.
     */
    int DEPARTMENT_CATEGORY_FOLDER = 136;
    /**
     * Organization category folder type.
     */
    int POSITION_CATEGORY_FOLDER = 137;
    /**
     * Organization category folder type.
     */
    int RANK_CATEGORY_FOLDER = 138;
    /**
     * User management folder type.
     */
    int USER_MANAGEMENT_FOLDER = 139;
    /**
     * Mobile application folder type. This folder contains
     * all mobile application micro services.
     */
    int MOBILE_APP_FOLDER = 140;
    /**
     * Holiday root folder type. This root folder contains all holiday
     * defined by user.
     */
    int HOLIDAY_FOLDER = 145;
    /**
     * Holiday root folder type. This root folder contains all holiday
     * defined by user.
     */
    int INVOICE_APP_APPROVAL_FOLDER = 146;
}
