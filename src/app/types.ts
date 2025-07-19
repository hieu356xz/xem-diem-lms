type BaseResponse = {
  code: string;
  message: string;
  data: unknown;
};

type UserProfileData = {
  id: number;
  user_id: number;
  student_code: string;
  full_name: string;
  name: string;
  birthday: string;
  gender: string;
  address: string | null;
  full_name_slug: string;
  category_id: number;
  category_name: string;
  makhoa: number;
  tenkhoa: string | null;
  tenlop_quanly: string;
  khoadaotao: string;
  teacher: number;
  new_personal_info: string | null;
  donvi_chuyenmon_id: number;
  bomon_id: number;
  google_meet: string | null;
  social_link: string | null;
  created_by: number;
  updated_by: number;
  deleted: number;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  deleted_by: number;
};

type UserProfileResponse = BaseResponse & {
  draw: number;
  next: number;
  count: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: UserProfileData[];
};

type ClassStudentData = {
  namhoc: string;
  hocky: number;
  class_id: number;
};

type ProcessHeadersResult = {
  headers: Record<string, string>;
  studentId: number | null;
  classId: number | null;
};

type ClassStudentResponse = BaseResponse & {
  draw: number;
  next: number;
  count: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: ClassStudentData[];
};

type ClassManager = {
  avatar: string | null;
  username: string;
  display_name: string;
  email: string;
  phone: string;
};

type ClassDetailData = {
  id: number;
  category_id: number;
  nganh_bomon_id: number;
  course_id: number;
  name: string;
  kyhieu: string;
  sotinchi: number;
  slug: string;
  course_info: string | null;
  manager_ids: string;
  manager_info: string;
  status: number;
  trongso: string | null;
  params: string | null;
  image: string | null;
  user_id: number;
  time_start: string | null;
  time_end: string | null;
  hocky: number;
  khoa: string;
  dothoc: number;
  sosv_dangky: string | null;
  namhoc: string;
  price: string | null;
  approve_status: number;
  approve_info: string | null;
  link_googlemeet: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  deleted_by: number;
  created_by: number;
  updated_by: number;
  managers: ClassManager[];
};

type ClassDetailResponse = BaseResponse & {
  data: ClassDetailData;
};

type CoursePlanActivityData = {
  id: number;
  class_id: number;
  course_id: number;
  course_plan_activity_id: number;
  week: number;
  title: string | null;
  date_start_of_week: string | null;
  date_end_of_week: string | null;
  teaching_day: string | null;
};

type CoursePlanResponse = BaseResponse & {
  draw: number;
  next: number;
  count: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: CoursePlanActivityData[];
};

type TestResultData = {
  id: number;
  class_plan_activity_id: number;
  course_id: number;
  av: number;
  class_id: number;
  old_class_id: number;
  move_data_by: number;
  week: number;
  student_id: number;
  trudiem: number;
  time: number;
  with_correct_answers: number;
  note: string;
  vipham: number;
  note_vipham: string;
  tracking: string | null;
  env: string;
  passing_point: number;
  passed: number;
  questions: number[];
  params: {
    content: Record<string, unknown>;
    totalQuestion: number;
  };
  locked: number;
  closed: number;
  type: string;
  violation_of_exam: string | null;
  submit_by: number;
  submit_at: string;
  status: number;
  is_deleted: number;
  deleted_by: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  scan: number;
  point_type: string;
  hocky: number | null;
  tong_diem: number;
};

type AllTestResultsResponse = BaseResponse & {
  draw: number;
  next: number;
  count: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: TestResultData[];
};

type TestQuestion = {
  id: number;
  question_number: number;
  question_direction: string;
  question_type: string;
  answer_option: { id: string; value: string }[];
  shuff: string | null;
  part: number;
  group_id: number;
  media: string | null;
  config: {
    cols: number;
    invertedAnswer: boolean;
  };
  skill: string | null;
  cdr: number;
  code: string;
  number_answer_correct: number;
};

type TestDetailData = {
  id: number;
  class_plan_activity_id: number;
  av: number;
  class_id: number;
  time: number;
  questions: number[];
  course_id: number;
  status: number;
  test: TestQuestion[];
};

type TestDetailResponse = BaseResponse & {
  draw: number;
  next: number;
  count: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: TestDetailData[];
};

export type {
  BaseResponse,
  UserProfileResponse,
  ClassStudentResponse,
  ProcessHeadersResult,
  ClassDetailResponse,
  AllTestResultsResponse,
  TestDetailResponse,
  UserProfileData,
  ClassStudentData,
  ClassDetailData,
  TestResultData,
  TestQuestion,
  TestDetailData,
  CoursePlanActivityData,
  CoursePlanResponse,
};
