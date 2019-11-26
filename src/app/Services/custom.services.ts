export class EventManager {
  events = {};
  public eventManager = () => {

    return {
      publish: (name, data) => {
        const handlers = this.events[name];
        if (!!handlers === false) {
          return;
        }
        console.log('Handlers ==> ', handlers);
        handlers.forEach((handler) => {
          handler.call(this, data);
        });
      },
      subscribe: (name, handler) => {
        let handlers = this.events[name];
        if (!!handlers === false) {
          handlers = this.events[name] = [];
        }
        handlers.push(handler);
      }
    };
  }
}
