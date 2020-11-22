/**
 *
 */
package com.cloudibpm.blo.experiment;

import com.cloudibpm.core.repository.BusinessLogicObject;
import com.cloudibpm.eso.experiment.TrainingPersionEso;
import com.cloudibpm.experiment.TrainingPerson;
import com.cloudibpm.experiment.TrainingPersonPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * This class is for training new staff to improve their development skills.
 *
 * @author Dahai Cao
 * @date 2018-05-20 17:07
 */
//@Transactional
@Service
public class TrainingPersionBlo extends BusinessLogicObject {
    private final TrainingPersionEso tpEso;


    @Autowired
    public TrainingPersionBlo(TrainingPersionEso tpEso) {
        this.tpEso = tpEso;
    }

    /**
     * Get one page of training person without any condition but only
     * <code>pageno</code> and <code>pagesize</code>.
     *
     * @param pageno   int
     * @param pagesize int
     * @return TrainingPersonPage
     * @throws Exception
     */
    public TrainingPersonPage getTrainingPersons(int pageno, int pagesize) throws Exception {

        TrainingPersonPage page = new TrainingPersonPage(pageno, pagesize);
        int total = tpEso.getAllTrainingPersonCounting("");
        if (total == 0) {
            page.setPageSize(pagesize);
            page.setPageNo(0);
            page.setAllEntitiesCount(0);
            page.setAllPagesCount(0);
            page.setPageIndex(0);
        } else {
            page.setPageSize(pagesize);
            page.setPageNo(pageno);
            page.setAllEntitiesCount(total);
            int n = total / pagesize;
            int m = total % pagesize;
            if (m > 0) {
                n = n + 1;
            }
            page.setAllPagesCount(n);
            int pageindex = (pageno - 1) * pagesize;
            page.setPageIndex(pageindex);
            List<TrainingPerson> persons = tpEso.queryAll(pageindex, pagesize);
            page.setPageEntities(persons.toArray(new TrainingPerson[persons.size()]));
        }
        return page;
    }

    /**
     * Get one page of training person with condition but only
     * <code>pageno</code> and <code>pagesize</code>.
     * <p>
     * To do it by XuanQi team members. please refer to the
     * com.cloudibpm.blo.om.user.WfStaffBlo
     *
     * @param condition String
     * @param pageno    int
     * @param pagesize  int
     * @return TrainingPersonPage
     * @throws Exception
     * @date 2018-05-20
     */
    public TrainingPersonPage searchTrainingPersons(String condition, int pageno, int pagesize) throws Exception {
        TrainingPersonPage page = new TrainingPersonPage(pageno, pagesize);

        int total = tpEso.getAllTrainingPersonCounting(condition);
        if (total == 0) {
            page.setPageSize(pagesize);
            page.setPageNo(0);
            page.setAllEntitiesCount(0);
            page.setAllPagesCount(0);
            page.setPageIndex(0);
        } else {
            page.setPageSize(pagesize);
            if (condition == null || condition.equals("")) {
                page.setPageNo(pageno);
                page.setAllEntitiesCount(total);
                int n = total / pagesize;
                int m = total % pagesize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                int pageindex = (pageno - 1) * pagesize;
                page.setPageIndex(pageindex);


                List<TrainingPerson> tp = tpEso.queryAll(pageindex, pagesize);
                page.setPageEntities(tp.toArray(new TrainingPerson[tp.size()]));
            } else {
                total = tpEso.getAllTrainingPersonCounting(condition);
                page.setAllEntitiesCount(total);
                int n = total / pagesize;
                int m = total % pagesize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                int pageindex = (pageno - 1) * pagesize;//pageindex是限制查询数量
                System.out.println("blo:pageindex:" + pageindex);
                List<TrainingPerson> tp = tpEso.queryAll(condition, pageindex, pagesize);
                System.out.println("查询到 信息条数：" + tp.size());
                //System.out.println("名：" + tp.get(0).getFirstName());

                page.setPageEntities(tp.toArray(new TrainingPerson[tp.size()]));


//				int pageindex = (pageno - 1) * pagesize;//pageindex是限制查询数量
// 				System.out.println("blo:pageindex:" + pageindex);
//				List<TrainingPerson> tp = personEso.queryAll(condition, pageindex, pagesize);
//				total = tp.size();
//				System.out.println("查询到 信息条数：" + total);
//				page.setAllEntitiesCount(total);  //总人数
//				int n = total / pagesize;
//				int m = total % pagesize;
//				if (m > 0) {
//					n = n + 1;
//				}
//				page.setAllPagesCount(n);   //总页数
//				page.setPageEntities(tp.toArray(new TrainingPerson[tp.size()]));

            }
        }
        return page;
    }
	
	/*public TrainingPersonPage searchTrainingPerson(String condition, int pageno, int pagesize) throws Exception {
		TrainingPersonPage page = new TrainingPersonPage(pageno, pagesize);
		return page;
	}*/

    /**
     * Create a new training person into repository.
     *
     * @param tp TrainingPerson
     * @throws Exception
     */
    public void create(TrainingPerson tp) throws Exception {

        tpEso.insert(tp);
    }

    public void updatePerson(TrainingPerson tp) throws Exception {

        tpEso.update(tp);
    }

    public void deletePerson(String id) throws Exception {

        tpEso.delete(id);
    }
}
