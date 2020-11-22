package com.cloudibpm.core.repository;

/**
 * Business Logic Object 是业务逻辑对象，这个类的设计初衷是，与界面的控制逻辑进行分离，<br>
 * 所有的业务逻辑都实现在该层，该层连接着下面的数据库访问层SQL执行对象(Execute SQL Object)，<br>
 * 该层的业务逻辑实现可以为将来设计工作流管理系统的访问接口提供基础。该层可以直接调用SQL执行对象，<br>
 * 同时也可以调用同层的其它业务逻辑对象，该层的所有方法现都设计成静态方法。
 * 
 * @author CAO Dahai
 * 
 */
public abstract class BusinessLogicObject {

}
