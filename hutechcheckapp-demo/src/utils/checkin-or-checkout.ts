import {
  CHECKIN_API_URL,
  DASHBOARD_CERTS_API_URL,
  DASHBOARD_CONFIG_API_URL,
  DASHBOARD_STUDENTS_API_URL,
  formatCertNumber,
  getCertYear,
  HOSTS_API_URL,
  showToast,
} from "@/utils";
import axios from "axios";

const checkStudentId = async (studentId: string) => {
  const studentIdPattern = (
    await axios.get(`${DASHBOARD_CONFIG_API_URL}/get-student-id-pattern`)
  ).data;

  if (studentIdPattern != "") {
    return new RegExp(studentIdPattern.slice(1, -1)).test(studentId);
  } else {
    return true;
  }
};

const checkExistStudentId = async (studentId: string) => {
  const isExist = (
    await axios.get(
      `${DASHBOARD_STUDENTS_API_URL}/check-exist-student-id?studentId=${studentId}`
    )
  ).data.value;

  return isExist;
};

const checkStudentCheckedIn = async (eventId: string, studentId: string) => {
  const value = (
    await axios.get(
      `${DASHBOARD_CERTS_API_URL}/check-student-checked-in?evId=${eventId}&stId=${studentId}`
    )
  ).data.value;

  return value;
};

const getCertSuffix = async (hostId: string) => {
  const value = (
    await axios.get(`${HOSTS_API_URL}/get-cert-suffix?host=${hostId}`)
  ).data.value;

  return value;
};

const getCertId = async (suffix: string) => {
  const value = (
    await axios.get(`${DASHBOARD_CERTS_API_URL}/get-cert-id?suffix=${suffix}`)
  ).data.value;
  return formatCertNumber(value, 6);
};

const handleCheckin = async (
  eventId: string,
  eventName: string,
  hostId: string,
  studentId: string,
  checkinBy: string
) => {
  const existStudentId = await checkExistStudentId(studentId);
  if (!existStudentId) {
    await axios.post(`${DASHBOARD_STUDENTS_API_URL}/add-null`, { studentId });
  }

  const certSuffix = await getCertSuffix(hostId);

  const certId = await getCertId(certSuffix);

  console.log(`${certId}/${certSuffix}`);

  await axios.post(`${DASHBOARD_CERTS_API_URL}/checkin`, {
    evId: eventId,
    studentId: studentId,
    certId: certId,
    certSuffix: certSuffix,
    userId: checkinBy,
  });

  axios.post(
    `${CHECKIN_API_URL}/thank-you`,
    {
      eventName: eventName,
      studentId: studentId,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const handleCheckout = async (eventId: string, studentId: string) => {
  await axios.post(`${DASHBOARD_CERTS_API_URL}/checkout`, {
    evId: eventId,
    studentId: studentId,
  });
};

const handleCheckinAgain = async (eventId: string, studentId: string) => {
  await axios.post(`${DASHBOARD_CERTS_API_URL}/checkin-again`, {
    evId: eventId,
    studentId: studentId,
  });
};

export const onCheckinOrCheckout = async (
  eventId: string,
  eventName: string,
  hostId: string,
  studentId: string,
  checkinBy: string
) => {
  let succeeded: boolean = false;

  const validStudentId = await checkStudentId(studentId);

  if (validStudentId) {
    const state = await checkStudentCheckedIn(eventId, studentId);

    if (state === 0) {
      handleCheckin(eventId, eventName, hostId, studentId, checkinBy);
      showToast(`Check-in sinh viên ${studentId} thành công.`);
      succeeded = true;
    } else if (state === 1) {
      handleCheckout(eventId, studentId);
      showToast(`Check-out sinh viên ${studentId} thành công.`);
      succeeded = true;
    } else if (state === 2) {
      handleCheckinAgain(eventId, studentId);
      showToast(
        `Đã check-in sinh viên ${studentId} tham dự lại sự kiện (Hủy check-out).`
      );
      succeeded = true;
    } else {
      succeeded = false;
    }
  } else {
    showToast("Mã số sinh viên không hợp lệ.");
    succeeded = false;
  }

  return { succeeded };
};
