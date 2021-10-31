import machine
import hcsr04
import utime as time

def sub_cb(topic, msg):
  print((topic, msg))
  if topic == b'notification' and msg == b'received':
    print('ESP received a notification message')

def connect_and_subscribe():
  global client_id, mqtt_server, topic_sub
  client = MQTTClient(client_id, mqtt_server)
  client.set_callback(sub_cb)
  client.connect()
  client.subscribe(topic_sub)
  print('Connected to %s MQTT broker, subscribed to %s topic' % (mqtt_server, topic_sub))
  return client

def restart_and_reconnect():
  print('Failed to connect to MQTT broker. Reconnecting...')
  time.sleep(10)
  machine.reset()

try:
  client = connect_and_subscribe()
except OSError as e:
  restart_and_reconnect()

sensor = hcsr04.HCSR04(trigger_pin=13,echo_pin=12,echo_timeout_us=1000000)
ledgreen = machine.Pin(15, machine.Pin.OUT)
ledred = machine.Pin(4, machine.Pin.OUT)
    
    
while True:
  try:
    client.check_msg()
    if (time.time() - last_message) > message_interval:
      sensor.distance_cm()       
      msg = str(sensor.distance_cm())      
      client.publish(topic_pub, msg)
      last_message = time.time()
      counter += 1
         
    distance = (sensor.distance_cm())
    print (distance)
    if distance <=6:
        ledgreen.off()
        ledred.on()
    else:
        ledgreen.on()
        ledred.off()
        time.sleep_ms(1000)     
  except OSError as e:
    restart_and_reconnect()
