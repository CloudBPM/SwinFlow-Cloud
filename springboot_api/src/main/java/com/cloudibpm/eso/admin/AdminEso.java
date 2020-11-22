package com.cloudibpm.eso.admin;

import com.cloudibpm.core.PageObject;
import com.model.course.Audio;
import com.model.course.Book;
import com.model.course.Live;
import com.model.course.Video;
import com.mongodb.client.result.DeleteResult;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author: yaofeng
 * @create:2019-03-14-15:16
 **/
@Repository
public class AdminEso {

    private final MongoTemplate nosqlTemplate;

    public AdminEso(MongoTemplate nosqlTemplate) {
        this.nosqlTemplate = nosqlTemplate;
    }

    /**
     * 保存电子书
     *
     * @param book
     * @return
     */
    public void saveBook(Book book) {
        nosqlTemplate.insert(book, "book_course");
    }

    /**
     * 保存音频
     *
     * @param audio
     */
    public void saveAudio(Audio audio) {
        nosqlTemplate.insert(audio, "audio_course");
    }

    /**
     * 保存直播信息
     *
     * @param live
     */
    public void saveLive(Live live) {
        nosqlTemplate.insert(live, "live_course");
    }

    /**
     * 保存视频信息
     * @param video
     */
    public void saveVideo(Video video) {
        nosqlTemplate.insert(video,"video_course");
    }
    /**
     * 根据用户id统计书籍数量
     *
     * @param userId
     * @return
     */
    public long  count( String type,String userId,Class<?> entityClass,String table) {
        Query query = new Query();
//        if (StringUtils.isEmpty(userId)) {
//            query.addCriteria(Criteria.where("userId").is(userId));
//        }
        if (!StringUtils.isBlank(type)&&type.equals("0")){
            query.addCriteria(Criteria.where("isSell").is(0));
        }
        return nosqlTemplate.count(query, entityClass, table);
    }

    /**
     * 查询电子书
     * @param pageNo
     * @param pageSize
     * @param page
     * @param userId
     * @return
     */
    public List<Book> queryBook(int pageNo, int pageSize, PageObject page, String userId,String type) {
        Query query = new Query();
        query.skip((pageNo - 1) * pageSize);
        query.limit(pageSize);
//        if (!StringUtils.isBlank(userId)) {
//            query.addCriteria(Criteria.where("userId").is(userId));
//        }
        if (!StringUtils.isBlank(type)&&type.equals("0")){
            query.addCriteria(Criteria.where("isSell").is(0));
        }
        List<Book> bookList = nosqlTemplate.find(query, Book.class, "book_course");
        return bookList;
    }

    /**
     * 按条件查询电子书
     * @param pageNo
     * @param pageSize
     * @param page
     * @param userId
     * @param cond
     * @return
     */
    public List<Book> queryBookForCond(int pageNo, int pageSize, PageObject page, String userId, String cond,String type) {
        Query query = new Query();
        query.skip((pageNo - 1) * pageSize);
        query.limit(pageSize);
        Criteria criteria = new Criteria();
//        if (!StringUtils.isBlank(userId)) {
//            query.addCriteria(Criteria.where("userId").is(userId));
//        }
        if (!StringUtils.isBlank(type)&&type.equals("0")){
            query.addCriteria(Criteria.where("isSell").is(0));
        }
        query.addCriteria(criteria.orOperator(Criteria.where("bookName").is(cond), Criteria.where("bookAuthor")
                .is(cond), Criteria.where("descript").is(cond)));
        List<Book> books = nosqlTemplate.find(query, Book.class, "book_course");
        return books;
    }

    /**
     * 查询音频
     * @param pageNo
     * @param pageSize
     * @param page
     * @param userId
     * @return
     */
    public List<Audio> queryAudio(int pageNo, int pageSize, PageObject page, String userId,String type) {
        Query query = new Query();
        query.skip((pageNo-1)*pageSize);
        query.limit(pageSize);
//        if (!StringUtils.isBlank(userId)){
//            query.addCriteria(Criteria.where("userId").is(userId));
//        }
        if (!StringUtils.isBlank(type)&&type.equals("0")){
            query.addCriteria(Criteria.where("isSell").is(0));
        }
        List<Audio> audio = nosqlTemplate.find(query, Audio.class, "audio_course");
        return audio;
    }

    /**
     * 按条件查询音频
     * @param pageNo
     * @param pageSize
     * @param page
     * @param userId
     * @param cond
     * @return
     */
    public List<Audio> queryAudioForCond(int pageNo, int pageSize, PageObject page, String userId, String cond,String type) {
        Query query = new Query();
        query.skip((pageNo - 1) * pageSize);
        query.limit(pageSize);
        Criteria criteria = new Criteria();
//        if (!StringUtils.isBlank(userId)){
//            query.addCriteria(criteria.where("userId").is(userId));
//        }
        if (!StringUtils.isBlank(type)&&type.equals("0")){
            query.addCriteria(Criteria.where("isSell").is(0));
        }
        query.addCriteria(criteria.orOperator(Criteria.where("audioName").is(cond), Criteria.where("audioDesc")
                .is(cond)));
        List<Audio> audio = nosqlTemplate.find(query, Audio.class, "audio_course");
        return audio;
    }

    /**
     * 查询直播
     * @param pageNo
     * @param pageSize
     * @param page
     * @param userId
     * @return
     */
    public List<Live> queryLive(int pageNo, int pageSize, PageObject page, String userId,String type) {
        Query query = new Query();
        query.skip((pageNo - 1) * pageSize);
        query.limit(pageSize);
//        if (StringUtils.isBlank(userId)){
//            query.addCriteria(Criteria.where("userId").is(userId));
//        }
        if (!StringUtils.isBlank(type)&&type.equals("0")){
            query.addCriteria(Criteria.where("isSell").is(0));
        }
        List<Live> lives = nosqlTemplate.find(query, Live.class, "live_course");
        return lives;
    }

    /**
     * 按条件查询直播
     * @param pageNo
     * @param pageSize
     * @param page
     * @param userId
     * @param cond
     * @return
     */
    public List<Live> queryLiveForCond(int pageNo, int pageSize, PageObject page, String userId, String cond,String type) {
        Query query = new Query();
        query.skip((pageNo-1)*pageSize);
        query.limit(pageSize);
        Criteria criteria = new Criteria();
//        if (!StringUtils.isBlank(userId)){
//            query.addCriteria(criteria.where("userId").is(userId));
//        }
        if (!StringUtils.isBlank(type)&&type.equals("0")){
            query.addCriteria(Criteria.where("isSell").is(0));
        }
        query.addCriteria(criteria.orOperator(Criteria.where("liveName").is(cond),Criteria.where("liveDesc")
        .is(cond),Criteria.where("liveInfo").is(cond)));
        List<Live> lives = nosqlTemplate.find(query, Live.class, "live_course");
        return lives;
    }

    /**
     * 查询视频
     * @param pageNo
     * @param pageSize
     * @param page
     * @param userId
     * @return
     */
    public List<Video> queryVide(int pageNo, int pageSize, PageObject page, String userId,String type) {
        Query query = new Query();
        query.skip((pageNo - 1) * pageSize);
        query.limit(pageSize);
//        if (!StringUtils.isBlank(userId)){
//            query.addCriteria(Criteria.where("userId").is(userId));
//        }
        if (!StringUtils.isBlank(type)&&type.equals("0")){
            query.addCriteria(Criteria.where("isSell").is(0));
        }
        List<Video> videos = nosqlTemplate.find(query, Video.class, "video_course");
        return videos;
    }

    /**
     * 按条件查询视频
     * @param pageNo
     * @param pageSize
     * @param page
     * @param userId
     * @param cond
     * @return
     */
    public List<Video> queryVideoForCond(int pageNo, int pageSize, PageObject page, String userId, String cond,String type) {
        Query query = new Query();
        query.skip((pageNo-1)*pageSize);
        query.limit(pageSize);
        Criteria criteria = new Criteria();
//        if (!StringUtils.isBlank(userId)){
//            query.addCriteria(criteria.where("userId").is(userId));
//        }
        if (!StringUtils.isBlank(type)&&type.equals("0")){
            query.addCriteria(Criteria.where("isSell").is(0));
        }
        query.addCriteria(criteria.orOperator(Criteria.where("videoName").is(cond),Criteria.where("videoDesc")
                .is(cond)));
        List<Video> videos = nosqlTemplate.find(query, Video.class, "video_course");
        return videos;
    }

    /**
     * 删除操作
     * @param id 记录ID
     * @param entryClass 实体类的class文件
     * @param table  表名
     * @return
     */
    public int delete(String id,Class<?> entryClass,String table) {
        DeleteResult id1 = nosqlTemplate.remove(new Query(Criteria.where("id").is(id)), entryClass,table);
        int count =(int) id1.getDeletedCount();
        return count;
    }

    /**
     * 修改书籍
     * @param book
     */
    public void updateBook(Book book) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(book.getId()));
        Update update = new Update();
        update.set("bookName",book.getBookName());
        update.set("imagesPath",book.getImagePath());
        update.set("bookAuthor",book.getBookAuthor());
        update.set("descript",book.getDescript());
        update.set("sellType",book.getSellType());
        update.set("goodPrise",book.getGoodPrise());
        update.set("discountPrise",book.getDiscountPrise());
        nosqlTemplate.updateFirst(query, update, "book_course");
    }

    /**
     * 修改音频
     * @param audio
     */
    public void updateAudio(Audio audio) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(audio.getId()));
        Update update = new Update();
        update.set("audioName",audio.getAudioName());
        update.set("audioDesc",audio.getAudioDesc());
        update.set("sellType",audio.getSellType());
        update.set("goodPrise",audio.getGoodPrise());
        update.set("discountPrise",audio.getDiscountPrise());
        nosqlTemplate.updateFirst(query,update,"audio_course");
    }

    /**
     * 修改视频
     * @param video
     */
    public void updateVideo(Video video) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(video.getId()));
        Update update = new Update();
        update.set("videoName",video.getVideoName());
        update.set("videoDesc",video.getVideoDesc());
        update.set("sellType",video.getSellType());
        update.set("goodPrise",video.getGoodPrise());
        update.set("discountPrise",video.getDiscountPrise());
        nosqlTemplate.updateFirst(query,update,"video_course");
    }

    /**
     * 修改直播
     * @param live
     */
    public void updateLive(Live live) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(live.getId()));
        Update update = new Update();
        update.set("liveName",live.getLiveName());
        update.set("liveDesc",live.getLiveDesc());
        update.set("liveType",live.getLiveType());
        update.set("liveDate",live.getLiveDate());
        update.set("liveTime",live.getLiveTime());
        update.set("liveInfo",live.getLiveInfo());
        update.set("sellType",live.getSellType());
        update.set("goodPrise",live.getGoodPrise());
        update.set("discountPrise",live.getDiscountPrise());
        nosqlTemplate.updateFirst(query,update,"live_course");
    }

    /**
     * 上架电子书
     * @param id
     */
    public void onlineBook(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("isSell",0);
        nosqlTemplate.updateFirst(query,update,"book_course");
    }

    /**
     * 上架音频
     * @param id
     */
    public void onlineAudio(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("isSell",0);
        nosqlTemplate.updateFirst(query,update,"audio_course");
    }

    /**
     * 上架视频
     * @param id
     */
    public void onlineVideo(String id){
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("isSell",0);
        nosqlTemplate.updateFirst(query,update,"video_course");
    }

    /**
     * 上架直播
     * @param id
     */
    public void onlineLive(String id){
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("isSell",0);
        nosqlTemplate.updateFirst(query,update,"live_course");
    }

    /**
     * 下架电子书
     * @param id
     */
    public void offlineBook(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("isSell",1);
        nosqlTemplate.updateFirst(query,update,"book_course");
    }
    /**
     * 下架音频
     * @param id
     */
    public void offlineAudio(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("isSell",1);
        nosqlTemplate.updateFirst(query,update,"audio_course");
    }

    /**
     * 下架视频
     * @param id
     */
    public void offlineVideo(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("isSell",1);
        nosqlTemplate.updateFirst(query,update,"video_course");
    }

    /**
     * 下架直播
     * @param id
     */
    public void offlineLive(String id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        Update update = new Update();
        update.set("isSell",1);
        nosqlTemplate.updateFirst(query,update,"live_course");
    }
}
