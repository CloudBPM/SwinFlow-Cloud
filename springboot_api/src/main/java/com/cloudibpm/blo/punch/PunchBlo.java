package com.cloudibpm.blo.punch;

import com.cloudibpm.blo.buildtime.id.BuildtimeIDGenerator;
import com.cloudibpm.eso.punch.PunchEso;
import com.model.Punch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
//@Transactional
public class PunchBlo {
    private final PunchEso punchEso;
    private final BuildtimeIDGenerator buildtimeIDGenerator;

    @Autowired
    public PunchBlo(PunchEso punchEso, BuildtimeIDGenerator buildtimeIDGenerator) {
        this.punchEso = punchEso;
        this.buildtimeIDGenerator = buildtimeIDGenerator;
    }

    /**
     * 保存消息
     *
     * @param messageFormat
     */
    public String savePunchInfo(Punch punch) throws Exception {
        punch.setId(buildtimeIDGenerator.getNewRunTimeID());
        punchEso.savePunchInfo(punch);
        return punch.getId();
    }
}
