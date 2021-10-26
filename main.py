import machine
import hcsr04
import utime as time

def main():
    sensor = hcsr04.HCSR04(trigger_pin=13,echo_pin=12,echo_timeout_us=1000000)
    
    ledgreen = machine.Pin(15, machine.Pin.OUT)
    ledred = machine.Pin(4, machine.Pin.OUT)
    
    
    while True:
        distance = (sensor.distance_cm())
        print (distance)
        if distance <=6:
            ledgreen.off()
            ledred.on()
        else:
            ledgreen.on()
            ledred.off()
            time.sleep_ms(1000)     
main()