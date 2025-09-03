// Promise có 3 trạng thái
// pending: đang chờ
//fulfilled: hoàn thành thành công, gọi resolve
//rejected: thất bại gọi reject
//. then/ .catch rõ ràng
//.catch gom lỗi một chỗ
import { Hello } from "./bai_1";
import { Number } from "./bai_2";
import { Error } from "./bai_3";
import { Random } from "./bai_4";
import { SimulateTask } from "./bai_5";
import { Simulated } from "./bai_6";
import { Race } from "./bai_7";
import { Calculate } from "./bai_8";
import { ArrayPromise } from "./bai_9";
import { Finally } from "./bai_10";
import { HelloAsync } from "./bai_11";
import { SimulateTask_2 } from "./bai_12";
import { Random_2 } from "./bai_13";
import { MultiplyAsync } from "./bai_14";
import { SequentialTasks } from "./bai_15";
import { ParallelTasks } from "./bai_16";
import { IteratePromises } from "./bai_17";
import { FetchUser } from "./bai_18";
import { FetchUsers } from "./bai_19";
import { FetchUserWithTimeout } from "./bai_20";
// new Hello();
// new Number();
// new Error();
// new Random();
// new SimulateTask();
// new Simulated();
// new Race();
// new Calculate();
// new ArrayPromise();
// new Finally();
// new HelloAsync().run();
// new SimulateTask_2();
// new Random_2();
// new MultiplyAsync();
// new SequentialTasks().run();
// new ParallelTasks().run();
// new IteratePromises().run();
// new FetchUser().run(1);
// new FetchUsers().run([1, 2, 3]);
new FetchUserWithTimeout().run(99);
