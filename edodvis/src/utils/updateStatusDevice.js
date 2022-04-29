import { updateDeviceStatus } from "../API/apis";

const updateStatusDevice = async () => {
  try {
    await updateDeviceStatus();
    console.log("device status updated!");
  } catch (e) {
    console.log(e);
  }
};

export { updateStatusDevice };
