/*
Riven
load dependency
"newland": "file:../pxt-newland"
*/

//% color="#5c7cfa" weight=10 icon="\uf108"
//% groups='["Basic"]'
namespace MaixDuino {
  //type起个新类型

  type Evtxye = (x: string) => void

  let btnEvt: Evtxye = null

  export enum SerialPorts {
    PORT1 = 0,
    PORT2 = 1,
    PORT3 = 2,
    PORT4 = 3,
  }

  export enum VolumeNum {
    //% block=Volume5
    Volume5 = 5,
    //% block=Volume0
    Volume0 = 0,
    //% block=Volume1
    Volume1 = 1,
    //% block=Volume2
    Volume2 = 2,
    //% block=Volume3
    Volume3 = 3,
    //% block=Volume4
    Volume4 = 4,
  }

  export enum GpicSet {
    //% block=setH
    setH = 1,
    //% block=setL
    setL = 2,
    //% block=get
    get = 3,
  }




  export enum OnOffDirection {
    //% block=On
    On = 1,
    //% block=Off
    Off = 0,
  }

  export enum LcdDirection {
    //% block=Front
    Front = 0,
    //% block=Back
    Back = 2,
  }



  serial.onDataReceived('\n', function () {

    let a = serial.readUntil('\n')
    if (a.indexOf("[") != -1) {
      basic.showNumber(7)
    } else {
      // let b = '{"SKU":1002,"Name_CN":"瓜子","Name_PY":"guazi","Price":10.00}';
      //let obj = JSON.parse(a);
      basic.showNumber(9)
      // basic.showString(obj.Price)
      let diseasesValue = a;
      if (btnEvt) {
        btnEvt(diseasesValue) // btna btnb  
      }
      let cmd = 42;
      control.raiseEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 0x8900 + cmd)
    }

  })

  function asyncWrite(msg: string, evt: number): void {
    serial.writeLine(msg)
    //control.waitForEvent(EventBusSource.MES_BROADCAST_GENERAL_ID, 0x8900 + evt)

  }

  /**
   * init serial port
   * @param tx Tx pin; eg: SerialPin.P13
   * @param rx Rx pin; eg: SerialPin.P14
   */
  //% blockId=newland_init block="Newland init|Tx pin %tx|Rx pin %rx"
  //% group="Basic" weight=100
  export function newland_init(tx: SerialPin, rx: SerialPin): void {
    serial.redirect(tx, rx, BaudRate.BaudRate115200)
    serial.readString()
    serial.setRxBufferSize(128)
    serial.writeString('\n\n')
    basic.pause(300)
  }



  //% blockId=newland_gpio_control block="Gpic pin %tx Set %dir"
  //% group="Basic" weight=98
  export function newland_gpio_control(tx: SerialPin, dir: GpicSet): void {
    //let a = '["GPIO", "pin4", "setH"]';
    let setValue = 'get'
    if (dir == 1) {
      setValue = 'setH'
    } else if (dir == 2) {
      setValue = 'setL'
    } else if (dir == 3) {
      setValue = 'get'
    }
    let txStr = '';
    if (tx >= 100 && tx <= 116) {
      txStr = 'pin' + (tx - 100);
    }
    let jsonStr = '["GPIO", "' + txStr + '","' + setValue + '"]';
    serial.writeLine(jsonStr);
    basic.pause(100)
  }

  /**
   * @param th pwn duty cycle; eg: 50
   */
  //% blockId=newland_pwm_control block="Newland  pwn duty cycle%th"
  //% group="Basic" weight=98
  //% th.min=0 th.max=100
  export function newland_pwm_control(th: number): void {
    //let a = '["PWM", 0]';
    let jsonStr = '["PWM", ' + th + ']';
    serial.writeLine(jsonStr);
    basic.pause(100)
  }
  /**
   * @param th model name; eg: diseases
   */
  //% blockId=newland_load_model block="Newland  load model%th"
  //% group="Basic" weight=98
  export function newland_load_model(th: string): void {
    //let a = '  ["KPU", "load", "diseases"]';
    let jsonStr = '["KPU", "load", "' + th + '"]';
    serial.writeLine(jsonStr);
    basic.pause(100)
  }

  //% blockId=newland_detect_model block="Newland model detect"
  //% group="Basic" weight=98
  export function newland_detect_model(): void {
    //let a = '["KPU", "load", "diseases"]';
    let jsonStr = '["KPU", "detect"]';
    serial.writeLine(jsonStr);
    basic.pause(100)
  }


  //% blockId=newland_detectionname block="on detectio Name"
  //% group="Basic" weight=51 draggableParameters=reporter blockGap=40
  export function newland_detectionname(handler: (txt: string) => void) {
    btnEvt = handler
  }




}
