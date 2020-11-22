package com.cloudibpm.blo.admin;

import com.cloudibpm.core.PageObject;
import com.cloudibpm.eso.admin.AdminEso;
import com.model.course.Audio;
import com.model.course.Book;
import com.model.course.Live;
import com.model.course.Video;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author: yaofeng
 * @create:2019-03-14-15:11
 **/
@Service
//@Transactional
public class AdminBlo {
    private final AdminEso adminEso;

    @Autowired
    public AdminBlo(AdminEso adminEso){
        this.adminEso = adminEso;
    }


    public void saveBook(Book book){
       adminEso.saveBook(book);
    }

    public void saveAudio(Audio audio){
        adminEso.saveAudio(audio);
    }

    public void saveLive(Live live) {
        adminEso.saveLive(live);
    }

    public void saveVideo(Video video) {
        adminEso.saveVideo(video);
    }
    /**
     * 查询所有书籍或者按条件查询
     * @param pageNo
     * @param pageSize
     * @param cond
     * @param userId
     * @return
     */
    public PageObject queryBook(int pageNo, int pageSize, String cond, String userId,String type) {
        PageObject page = new PageObject(pageNo, pageSize);
        long total = adminEso.count(type,userId,Book.class,"book_course");
        if (total==0){
            page.setPageSize(pageSize);
            page.setPageNo(1);
            page.setAllEntitiesCount(0);
            page.setAllPagesCount(0);
            page.setPageIndex(0);
        }else {
            if (cond==null||"".equals(cond)){
                page.setAllEntitiesCount(total);
                page.setPageNo(pageNo);
                long n = total / pageSize;
                long m = total % pageSize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                page.setPageSize(pageSize);
                List<Book> books = adminEso.queryBook(pageNo,pageSize,page,userId,type);
                page.setPageEntities(books.toArray(new Book[books.size()]));
            }else{//查询条件不为空
                page.setAllEntitiesCount(total);
                page.setPageNo(pageNo);
                long n = total / pageSize;
                long m = total % pageSize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                page.setPageSize(pageSize);
                List<Book> books = adminEso.queryBookForCond(pageNo,pageSize,page,userId,cond,type);
                page.setPageEntities(books.toArray(new Book[books.size()]));
            }
        }
        return page;
    }

    /**
     * 查询所有音频或者条件查询
     * @param parseInt
     * @param parseInt1
     * @param cond
     * @param userId
     * @return
     */
    public PageObject queryAudio(int pageNo, int pageSize, String cond, String userId,String type) {
        PageObject page = new PageObject(pageNo, pageSize);
        long total = adminEso.count(type,userId,Audio.class,"audio_course");
        if (total==0){
            page.setPageSize(pageSize);
            page.setPageNo(1);
            page.setAllEntitiesCount(0);
            page.setAllPagesCount(0);
            page.setPageIndex(0);
        }else {
            if (cond==null||"".equals(cond)){
                page.setAllEntitiesCount(total);
                page.setPageNo(pageNo);
                long n = total / pageSize;
                long m = total % pageSize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                page.setPageSize(pageSize);
                List<Audio> audios = adminEso.queryAudio(pageNo,pageSize,page,userId,type);
                page.setPageEntities(audios.toArray(new Audio[audios.size()]));
            }else{//查询条件不为空
                page.setAllEntitiesCount(total);
                page.setPageNo(pageNo);
                long n = total / pageSize;
                long m = total % pageSize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                page.setPageSize(pageSize);
                List<Audio> audios = adminEso.queryAudioForCond(pageNo,pageSize,page,userId,cond,type);
                page.setPageEntities(audios.toArray(new Audio[audios.size()]));
            }
        }
        return page;
    }

    /**
     * 查询直播信息
     * @param pageNo
     * @param pageSize
     * @param cond
     * @param userId
     * @return
     */
    public PageObject queryLive(int pageNo, int pageSize, String cond, String userId,String type) {
        PageObject page = new PageObject(pageNo, pageSize);
        long total = adminEso.count(type,userId,Live.class,"live_course");
        if (total==0){
            page.setPageSize(pageSize);
            page.setPageNo(1);
            page.setAllEntitiesCount(0);
            page.setAllPagesCount(0);
            page.setPageIndex(0);
        }else {
            if (cond==null||"".equals(cond)){
                page.setAllEntitiesCount(total);
                page.setPageNo(pageNo);
                long n = total / pageSize;
                long m = total % pageSize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                page.setPageSize(pageSize);
                List<Live> lives = adminEso.queryLive(pageNo,pageSize,page,userId,type);
                page.setPageEntities(lives.toArray(new Live[lives.size()]));
            }else{//查询条件不为空
                page.setAllEntitiesCount(total);
                page.setPageNo(pageNo);
                long n = total / pageSize;
                long m = total % pageSize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                page.setPageSize(pageSize);
                List<Live> lives = adminEso.queryLiveForCond(pageNo,pageSize,page,userId,cond,type);
                page.setPageEntities(lives.toArray(new Live[lives.size()]));
            }
        }
        return page;
    }

    /**
     * 查询视频信息
     * @param pageNo
     * @param pageSize
     * @param cond
     * @param userId
     * @return
     */
    public PageObject queryVideo(int pageNo, int pageSize, String cond, String userId,String type) {
        PageObject page = new PageObject(pageNo, pageSize);
        long total = adminEso.count(type,userId,Video.class,"video_course");
        if (total==0){
            page.setPageSize(pageSize);
            page.setPageNo(1);
            page.setAllEntitiesCount(0);
            page.setAllPagesCount(0);
            page.setPageIndex(0);
        }else {
            if (cond==null||"".equals(cond)){
                page.setAllEntitiesCount(total);
                page.setPageNo(pageNo);
                long n = total / pageSize;
                long m = total % pageSize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                page.setPageSize(pageSize);
                List<Video> videos = adminEso.queryVide(pageNo,pageSize,page,userId,type);
                page.setPageEntities(videos.toArray(new Video[videos.size()]));
            }else{//查询条件不为空
                page.setAllEntitiesCount(total);
                page.setPageNo(pageNo);
                long n = total / pageSize;
                long m = total % pageSize;
                if (m > 0) {
                    n = n + 1;
                }
                page.setAllPagesCount(n);
                page.setPageSize(pageSize);
                List<Video> videos = adminEso.queryVideoForCond(pageNo,pageSize,page,userId,cond,type);
                page.setPageEntities(videos.toArray(new Video[videos.size()]));
            }
        }
        return page;
    }

    /**
     * 删除操作
     * @param id
     * @param type
     * @return
     */
    public String delete(String id,String type) {
        int n =-1;
        if (type.equals("1")){  //E-book
            n = adminEso.delete(id,Book.class,"book_course");
        }else if (type.equals("2")){  //audio
            n = adminEso.delete(id,Audio.class,"audio_course");
        }else if (type.equals("3")){  //video
            n = adminEso.delete(id,Video.class,"video_course");
        }else if (type.equals("4")){  //live
            n = adminEso.delete(id,Live.class,"live_course");
        }
        if (n>0){
            return "1";
        }else {
            return "0";
        }
    }

    /**
     * 修改书籍
     * @param book
     */
    public void updateBook(Book book) {
        adminEso.updateBook(book);
    }

    /**
     * 修改音频
     * @param audio
     */
    public void updateAudio(Audio audio) {
        adminEso.updateAudio(audio);
    }

    /**
     * 修改视频
     * @param video
     */
    public void updateVideo(Video video) {
        adminEso.updateVideo(video);
    }

    /**
     * 修改直播
     * @param live
     */
    public void updateLive(Live live) {
        adminEso.updateLive(live);
    }

    /**
     * 上架操作
     * @param id
     * @param type
     */
    public void online(String id, String type) {
        if (type.equals("1")){  //电子书
            adminEso.onlineBook(id);
        }else if (type.equals("2")){  //音频
            adminEso.onlineAudio(id);
        }else if (type.equals("3")){  //视频
            adminEso.onlineVideo(id);
        }else if (type.equals("4")){  //直播
            adminEso.onlineLive(id);
        }
    }

    /**
     * 下架操作
     * @param id
     * @param type
     */
    public void offline(String id, String type) {
        if (type.equals("1")){  //电子书
            adminEso.offlineBook(id);
        }else if (type.equals("2")){  //音频
            adminEso.offlineAudio(id);
        }else if (type.equals("3")){  //视频
            adminEso.offlineVideo(id);
        }else if (type.equals("4")){  //直播
            adminEso.offlineLive(id);
        }
    }
}
