import { PrismaClient, Role, OrganizationNature, SkillCategory, OrgTaskStatus, VolunteerStatus, AwardStatus, ProfileStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Create users
  console.log('  Creating users...');
  const admin = await prisma.user.upsert({
    where: { studentId: 'admin' },
    update: {},
    create: {
      studentId: 'admin', name: '系统管理员', passwordHash, role: Role.COMMITTEE,
      email: 'admin@smbu.edu.cn', department: '校团委', profileStatus: ProfileStatus.APPROVED,
    },
  });

  const students = [];
  const studentData = [
    { studentId: '2023001', name: '张三', gender: 'MALE', ethnicity: '汉族', grade: '2023', department: '计算机科学与技术系', major: '计算机科学与技术', className: '计科2301班', volunteerNumber: 'V20230001', phone: '13800000001', wechat: 'zhangsan_wx', email: 'zhangsan@smbu.edu.cn', github: 'zhangsan', role: Role.STUDENT, profileStatus: ProfileStatus.APPROVED },
    { studentId: '2023002', name: '李四', gender: 'FEMALE', ethnicity: '汉族', grade: '2023', department: '数学系', major: '应用数学', className: '数学2301班', volunteerNumber: 'V20230002', phone: '13800000002', wechat: 'lisi_wx', email: 'lisi@smbu.edu.cn', role: Role.STUDENT, profileStatus: ProfileStatus.PENDING_REVIEW },
    { studentId: '2023003', name: '王五', gender: 'MALE', ethnicity: '汉族', grade: '2023', department: '计算机科学与技术系', major: '计算机科学与技术', className: '计科2301班', volunteerNumber: 'V20230003', phone: '13800000003', role: Role.ORG_LEADER, profileStatus: ProfileStatus.APPROVED },
    { studentId: '2023004', name: '赵六', gender: 'MALE', ethnicity: '满族', grade: '2022', department: '外语系', major: '俄语', className: '俄语2201班', volunteerNumber: 'V20230004', phone: '13800000004', role: Role.STUDENT, profileStatus: ProfileStatus.APPROVED },
    { studentId: '2023005', name: '钱七', gender: 'FEMALE', ethnicity: '汉族', grade: '2023', department: '经济系', major: '国际经济与贸易', className: '国贸2301班', volunteerNumber: 'V20230005', phone: '13800000005', role: Role.STUDENT, profileStatus: ProfileStatus.DRAFT },
    { studentId: '2023006', name: '孙八', gender: 'MALE', ethnicity: '汉族', grade: '2022', department: '计算机科学与技术系', major: '计算机科学与技术', className: '计科2201班', volunteerNumber: 'V20230006', phone: '13800000006', role: Role.ORG_LEADER, profileStatus: ProfileStatus.APPROVED },
    { studentId: '2023007', name: '周九', gender: 'FEMALE', ethnicity: '汉族', grade: '2023', department: '材料科学系', major: '材料科学与工程', className: '材料2301班', volunteerNumber: 'V20230007', phone: '13800000007', role: Role.STUDENT, profileStatus: ProfileStatus.APPROVED },
    { studentId: '2023008', name: '吴十', gender: 'MALE', ethnicity: '汉族', grade: '2024', department: '计算机科学与技术系', major: '人工智能', className: 'AI2401班', volunteerNumber: 'V20230008', phone: '13800000008', role: Role.STUDENT, profileStatus: ProfileStatus.DRAFT },
    { studentId: '2023009', name: '郑十一', gender: 'MALE', ethnicity: '回族', grade: '2022', department: '物理系', major: '应用物理', className: '物理2201班', volunteerNumber: 'V20230009', phone: '13800000009', role: Role.STUDENT, profileStatus: ProfileStatus.APPROVED },
    { studentId: '2023010', name: '冯十二', gender: 'FEMALE', ethnicity: '汉族', grade: '2023', department: '生物系', major: '生物技术', className: '生物2301班', volunteerNumber: 'V20230010', phone: '13800000010', role: Role.STUDENT, profileStatus: ProfileStatus.REJECTED },
  ];

  for (const data of studentData) {
    const student = await prisma.user.upsert({
      where: { studentId: data.studentId },
      update: {},
      create: { ...data, passwordHash },
    });
    students.push(student);
  }

  // 2. Create organizations
  console.log('  Creating organizations...');
  const orgData = [
    { fullName: '深圳北理莫斯科大学学生会', shortName: '校学生会', nature: OrganizationNature.STUDENT_ORG, teacherAdvisor: '李老师', description: '校学生会是学校最大的学生组织，负责统筹全校学生活动。' },
    { fullName: '深圳北理莫斯科大学计算机协会', shortName: '计算机协会', nature: OrganizationNature.STUDENT_ORG, teacherAdvisor: '王教授', description: '计算机协会致力于推广计算机技术，组织编程竞赛和技术分享。' },
    { fullName: '深圳北理莫斯科大学志愿者协会', shortName: '志愿者协会', nature: OrganizationNature.VOLUNTEER_ORG, teacherAdvisor: '张老师', description: '志愿者协会负责组织校内外志愿服务活动。' },
    { fullName: '深圳北理莫斯科大学文学社', shortName: '文学社', nature: OrganizationNature.STUDENT_ORG, teacherAdvisor: '刘老师', description: '文学社是热爱文学创作的同学们的家园。' },
    { fullName: '深圳北理莫斯科大学学生会体育部', shortName: '体育部', nature: OrganizationNature.FACULTY_DEPT, teacherAdvisor: '陈老师', description: '负责全校体育赛事的组织与协调。' },
  ];

  const orgs = [];
  for (const data of orgData) {
    const org = await prisma.organization.create({ data });
    orgs.push(org);
  }

  // 3. Create organization leaders
  console.log('  Creating organization leaders...');
  await prisma.organizationLeader.createMany({
    data: [
      { userId: students[2].id, organizationId: orgs[0].id, role: '主席' },
      { userId: students[5].id, organizationId: orgs[1].id, role: '会长' },
      { userId: students[0].id, organizationId: orgs[1].id, role: '技术部长' },
      { userId: students[1].id, organizationId: orgs[2].id, role: '会长' },
      { userId: students[3].id, organizationId: orgs[3].id, role: '社长' },
    ],
  });

  // 4. Create departments
  console.log('  Creating departments...');
  await prisma.department.createMany({
    data: [
      { name: '秘书处', organizationId: orgs[0].id },
      { name: '宣传部', organizationId: orgs[0].id },
      { name: '学术部', organizationId: orgs[0].id },
      { name: '文体部', organizationId: orgs[0].id },
      { name: '技术部', organizationId: orgs[1].id },
      { name: '竞赛部', organizationId: orgs[1].id },
    ],
  });

  // 5. Create skill tags
  console.log('  Creating skill tags...');
  const technicalSkills = ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'SQL', 'Linux', 'Git', 'Photoshop', 'Premiere', 'AutoCAD', 'MATLAB'];
  const planningSkills = ['活动策划', '文案撰写', '新媒体运营', '视频制作', '平面设计', '公关沟通', '演讲主持'];
  const managementSkills = ['项目管理', '团队领导', '时间管理', '财务管理', '人力资源'];
  const sportsSkills = ['篮球', '足球', '羽毛球', '乒乓球', '游泳', '田径', '网球', '排球'];

  const skillMap: Record<string, any> = {};
  for (const name of technicalSkills) {
    const tag = await prisma.skillTag.upsert({ where: { name_category: { name, category: SkillCategory.TECHNICAL } }, update: {}, create: { name, category: SkillCategory.TECHNICAL } });
    skillMap[name] = tag;
  }
  for (const name of planningSkills) {
    const tag = await prisma.skillTag.upsert({ where: { name_category: { name, category: SkillCategory.PLANNING } }, update: {}, create: { name, category: SkillCategory.PLANNING } });
    skillMap[name] = tag;
  }
  for (const name of managementSkills) {
    const tag = await prisma.skillTag.upsert({ where: { name_category: { name, category: SkillCategory.MANAGEMENT } }, update: {}, create: { name, category: SkillCategory.MANAGEMENT } });
    skillMap[name] = tag;
  }
  for (const name of sportsSkills) {
    const tag = await prisma.skillTag.upsert({ where: { name_category: { name, category: SkillCategory.SPORTS } }, update: {}, create: { name, category: SkillCategory.SPORTS } });
    skillMap[name] = tag;
  }

  // 6. Assign skills to users
  console.log('  Assigning skills to users...');
  await prisma.userSkillTag.createMany({
    data: [
      { userId: students[0].id, skillTagId: skillMap['Python'].id, level: 4 },
      { userId: students[0].id, skillTagId: skillMap['JavaScript'].id, level: 3 },
      { userId: students[0].id, skillTagId: skillMap['React'].id, level: 3 },
      { userId: students[0].id, skillTagId: skillMap['Git'].id, level: 4 },
      { userId: students[0].id, skillTagId: skillMap['Linux'].id, level: 3 },
      { userId: students[0].id, skillTagId: skillMap['篮球'].id, level: 2 },
      { userId: students[2].id, skillTagId: skillMap['TypeScript'].id, level: 5 },
      { userId: students[2].id, skillTagId: skillMap['Node.js'].id, level: 4 },
      { userId: students[2].id, skillTagId: skillMap['Vue'].id, level: 3 },
      { userId: students[2].id, skillTagId: skillMap['SQL'].id, level: 4 },
      { userId: students[2].id, skillTagId: skillMap['项目管理'].id, level: 3 },
      { userId: students[2].id, skillTagId: skillMap['团队领导'].id, level: 4 },
      { userId: students[3].id, skillTagId: skillMap['Java'].id, level: 3 },
      { userId: students[3].id, skillTagId: skillMap['C++'].id, level: 2 },
      { userId: students[3].id, skillTagId: skillMap['MATLAB'].id, level: 4 },
      { userId: students[3].id, skillTagId: skillMap['活动策划'].id, level: 3 },
      { userId: students[4].id, skillTagId: skillMap['Photoshop'].id, level: 4 },
      { userId: students[4].id, skillTagId: skillMap['Premiere'].id, level: 3 },
      { userId: students[4].id, skillTagId: skillMap['平面设计'].id, level: 4 },
      { userId: students[4].id, skillTagId: skillMap['新媒体运营'].id, level: 3 },
      { userId: students[5].id, skillTagId: skillMap['Python'].id, level: 5 },
      { userId: students[5].id, skillTagId: skillMap['SQL'].id, level: 5 },
      { userId: students[5].id, skillTagId: skillMap['Linux'].id, level: 4 },
      { userId: students[5].id, skillTagId: skillMap['Git'].id, level: 5 },
      { userId: students[5].id, skillTagId: skillMap['羽毛球'].id, level: 3 },
      { userId: students[6].id, skillTagId: skillMap['AutoCAD'].id, level: 3 },
      { userId: students[6].id, skillTagId: skillMap['文案撰写'].id, level: 4 },
      { userId: students[6].id, skillTagId: skillMap['演讲主持'].id, level: 5 },
      { userId: students[6].id, skillTagId: skillMap['游泳'].id, level: 4 },
    ],
  });

  // 7. Create volunteer records
  console.log('  Creating volunteer records...');
  const volunteerRecords = [
    { volunteerNumber: 'V20230001', activityName: '校园迎新志愿服务', activityDate: '2024-09-01', hours: 8.0, userId: students[0].id },
    { volunteerNumber: 'V20230001', activityName: '社区义教活动', activityDate: '2024-10-15', hours: 4.0, userId: students[0].id },
    { volunteerNumber: 'V20230001', activityName: '校园环保清洁', activityDate: '2024-11-20', hours: 3.0, userId: students[0].id },
    { volunteerNumber: 'V20230002', activityName: '图书馆整理志愿服务', activityDate: '2024-09-10', hours: 6.0, userId: students[1].id },
    { volunteerNumber: 'V20230002', activityName: '敬老院探访', activityDate: '2024-12-01', hours: 5.0, userId: students[1].id },
    { volunteerNumber: 'V20230003', activityName: '校园迎新志愿服务', activityDate: '2024-09-01', hours: 8.0, userId: students[2].id },
    { volunteerNumber: 'V20230003', activityName: '马拉松志愿者', activityDate: '2024-11-10', hours: 10.0, userId: students[2].id },
    { volunteerNumber: 'V20230004', activityName: '中俄文化交流活动', activityDate: '2024-10-01', hours: 6.0, userId: students[3].id },
    { volunteerNumber: 'V20230004', activityName: '校园迎新志愿服务', activityDate: '2024-09-01', hours: 8.0, userId: students[3].id },
    { volunteerNumber: 'V20230005', activityName: '校园义卖活动', activityDate: '2024-11-25', hours: 4.0, userId: students[4].id },
    { volunteerNumber: 'V20230006', activityName: '编程竞赛志愿服务', activityDate: '2024-10-20', hours: 6.0, userId: students[5].id },
    { volunteerNumber: 'V20230006', activityName: '校园迎新志愿服务', activityDate: '2024-09-01', hours: 8.0, userId: students[5].id },
    { volunteerNumber: 'V20230007', activityName: '校园迎新志愿服务', activityDate: '2024-09-01', hours: 8.0, userId: students[6].id },
    { volunteerNumber: 'V20230008', activityName: '校园迎新志愿服务', activityDate: '2024-09-01', hours: 8.0, userId: students[7].id },
    { volunteerNumber: 'V20230009', activityName: '物理实验开放日志愿', activityDate: '2024-11-15', hours: 5.0, userId: students[8].id },
    { volunteerNumber: 'V20230010', activityName: '校园迎新志愿服务', activityDate: '2024-09-01', hours: 8.0, userId: students[9].id },
    { volunteerNumber: 'V20230010', activityName: '生物科普进校园', activityDate: '2024-12-10', hours: 4.0, userId: students[9].id },
    { volunteerNumber: 'V20230001', activityName: '寒假支教活动', activityDate: '2025-01-15', hours: 40.0, userId: students[0].id },
    { volunteerNumber: 'V20230003', activityName: '寒假支教活动', activityDate: '2025-01-15', hours: 40.0, userId: students[2].id },
    { volunteerNumber: 'V20230006', activityName: '寒假支教活动', activityDate: '2025-01-15', hours: 40.0, userId: students[5].id },
  ];

  for (const record of volunteerRecords) {
    await prisma.volunteerRecord.create({
      data: { ...record, status: VolunteerStatus.APPROVED, source: 'MOCK' },
    });
  }

  // 8. Create organization tasks
  console.log('  Creating organization tasks...');
  const taskData: any[] = [
    { title: '筹备2024年迎新晚会', description: '负责迎新晚会的策划与执行', type: 'CROSS_DEPT', status: OrgTaskStatus.COMPLETED, priority: 'HIGH', organizationId: orgs[0].id, createdBy: admin.id },
    { title: '组织编程马拉松比赛', description: '校际编程竞赛的组织工作', type: 'SINGLE_DEPT', status: OrgTaskStatus.IN_PROGRESS, priority: 'HIGH', organizationId: orgs[1].id, createdBy: admin.id },
    { title: '招募迎新志愿者', description: '招募和培训迎新志愿者', type: 'SINGLE_DEPT', status: OrgTaskStatus.COMPLETED, priority: 'MEDIUM', organizationId: orgs[2].id, createdBy: admin.id },
    { title: '出版校刊第12期', description: '编辑和出版校刊', type: 'SINGLE_DEPT', status: OrgTaskStatus.VIEWED, priority: 'LOW', organizationId: orgs[3].id, createdBy: admin.id },
    { title: '组织校际篮球联赛', description: '与其他高校联合举办篮球联赛', type: 'CROSS_DEPT', status: OrgTaskStatus.PENDING_VIEW, priority: 'MEDIUM', organizationId: orgs[4].id, createdBy: admin.id },
    { title: '技术分享会：AI入门', description: '面向全校的AI技术入门分享', type: 'SINGLE_DEPT', status: OrgTaskStatus.IN_PROGRESS, priority: 'MEDIUM', organizationId: orgs[1].id, createdBy: students[2].id },
    { title: '志愿者培训', description: '新学期志愿者培训', type: 'HIERARCHICAL', status: OrgTaskStatus.PENDING_VIEW, priority: 'HIGH', organizationId: orgs[2].id, createdBy: admin.id },
    { title: '学生会换届选举', description: '组织新一届学生会换届选举', type: 'HIERARCHICAL', status: OrgTaskStatus.COMPLETED, priority: 'URGENT', organizationId: orgs[0].id, createdBy: admin.id },
    { title: '校园文化节策划', description: '策划年度校园文化节', type: 'CROSS_DEPT', status: OrgTaskStatus.IN_PROGRESS, priority: 'HIGH', organizationId: orgs[0].id, createdBy: admin.id },
    { title: 'Linux工作坊', description: '面向新生的Linux入门工作坊', type: 'SINGLE_DEPT', status: OrgTaskStatus.VIEWED, priority: 'LOW', organizationId: orgs[1].id, createdBy: students[5].id },
  ];

  for (const data of taskData) {
    await prisma.organizationTask.create({
      data: { ...data, deadline: new Date('2024-12-31') },
    });
  }

  // 9. Create awards
  console.log('  Creating awards...');
  const awardData = [
    { title: '优秀学生干部', level: '校级', userId: students[0].id, status: AwardStatus.APPROVED },
    { title: 'ACM程序设计竞赛银奖', level: '省级', userId: students[0].id, status: AwardStatus.APPROVED },
    { title: '数学建模竞赛一等奖', level: '国家级', userId: students[2].id, status: AwardStatus.APPROVED },
    { title: '优秀志愿者', level: '校级', userId: students[1].id, status: AwardStatus.PENDING_REVIEW },
    { title: '三好学生', level: '校级', userId: students[3].id, status: AwardStatus.APPROVED },
    { title: '创新创业大赛铜奖', level: '市级', userId: students[5].id, status: AwardStatus.APPROVED },
    { title: '英语演讲比赛二等奖', level: '校级', userId: students[4].id, status: AwardStatus.PENDING_REVIEW },
  ];

  for (const data of awardData) {
    await prisma.award.create({
      data: { ...data, awardDate: new Date('2024-06-01') },
    });
  }

  // 10. Create some plans
  console.log('  Creating sample plans...');
  const now = new Date();
  await prisma.plan.createMany({
    data: [
      { title: '复习高等数学', description: '准备期中考试', priority: 'HIGH', status: 'IN_PROGRESS', startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0), location: '图书馆', userId: students[0].id },
      { title: '完成编程作业', description: '数据结构实验报告', priority: 'MEDIUM', status: 'PENDING', startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0), location: '宿舍', userId: students[0].id },
      { title: '社团会议', description: '计算机协会周例会', priority: 'LOW', status: 'PENDING', startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 15, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 17, 0), location: '教学楼B-201', userId: students[2].id },
    { title: '俄语口语练习', description: '与外教对话练习', priority: 'MEDIUM', status: 'PENDING', startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 11, 30), location: '外语楼A-301', userId: students[3].id },
    { title: '志愿服务登记', description: '确认本月志愿时长', priority: 'LOW', status: 'COMPLETED', startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 9, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 10, 0), userId: students[1].id },
    { title: '健身', description: '去体育馆跑步', priority: 'LOW', status: 'PENDING', startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0), location: '体育馆', userId: students[6].id },
    { title: '准备比赛材料', description: '创新创业大赛PPT', priority: 'URGENT', status: 'IN_PROGRESS', startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 0), location: '宿舍', userId: students[5].id },
      { title: '读书笔记', description: '读完《算法导论》第三章', priority: 'MEDIUM', status: 'PENDING', startTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 14, 0), endTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 16, 0), location: '图书馆', userId: students[8].id },
    ],
  });

  console.log('');
  console.log('✅ Seeding completed!');
  console.log('');
  console.log('📋 Default test accounts:');
  console.log('   Admin:    admin / 123456  (团委管理员)');
  console.log('   Student:  2023001 / 123456  (张三 - 已完善档案)');
  console.log('   Student:  2023002 / 123456  (李四 - 待审核)');
  console.log('   Student:  2023003 / 123456  (王五 - 组织负责人)');
  console.log('   Student:  2023004 / 123456  (赵六 - 已完善档案)');
  console.log('   Student:  2023005 / 123456  (钱七 - 草稿)');
  console.log('   Student:  2023006 / 123456  (孙八 - 组织负责人)');
  console.log('   Student:  2023007 / 123456  (周九 - 已完善档案)');
  console.log('   Student:  2023008 / 123456  (吴十 - 草稿)');
  console.log('   Student:  2023009 / 123456  (郑十一 - 已完善档案)');
  console.log('   Student:  2023010 / 123456  (冯十二 - 已驳回)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
