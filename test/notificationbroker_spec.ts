
import {NotificationBroker} from '../src/common/notificationbroker';

enum TestNotification {
    Test1,
    Test2,
    Test3
}

describe('NotificationBroker', () => {
   
   it('Should be possible to create an instance', () => {
       const broker = new NotificationBroker<TestNotification>();
       expect(broker).toBeTruthy();
   });
   
   it('Should be possible to register a subscription', () => {
      const broker = new NotificationBroker<TestNotification>();
      let calledWith: number;
      const expectedValue = 10;
      broker.subscribe(TestNotification.Test1, arg => {
          calledWith = arg;
      });
            
      broker.publish(TestNotification.Test1, expectedValue);
      
      // Should be ignored
      broker.publish(TestNotification.Test2, 5);
      
      expect(calledWith).toBe(expectedValue);      
   });     
});


