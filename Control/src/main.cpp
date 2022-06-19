#include <Arduino.h>
// #include <NTPClient.h>
#include <WiFiUdp.h>
#include <WiFiClientSecure.h>

#include <SPI.h>
#include <WiFi.h>
#include "esp_wpa2.h"
#include <Wire.h>

#include <HTTPClient.h>

#define RXP1 16 //Defining UART With Vision (Pins 8 and 9 on Arduino Adaptor)
#define TXP1 17
#define RXP2 18 //Defining UART With Drive (Pins 6 and 7 on Arduino Adaptor)
#define TXP2 5

#define VSPI_MISO 15 //Defining SPI with Camera on Vision (Pins 10, 11, 12 and 13 on Arduino Adaptor)
#define VSPI_MOSI 4
#define VSPI_SCLK 2
#define VSPI_SS 14

WiFiUDP ntpUDP;
// NTPClient timeClient(ntpUDP);
WiFiClientSecure client;
SPIClass* vspi = NULL; //Container for VSPI connection

char Command[32];   // storage for the actual command
char DriveMsg[32];  // storage for drive's message
char VisionMsg[64]; // storage for vision's message

bool drive_ready = true;        // checks whether drive is ready for receiving command
bool drive_msg_ready = false;   // checks whether drive's message is ready for sending
bool vision_msg_ready = false;  // checks whether vision's message is ready for sending
bool command_ready = false;     // checks whether command is ready for sending command
bool connected = false;         // checks whether the ESP32 has already connected with the server

const char* host = "http://34.226.193.83/"; // aws

const char* ssid = "SSID"; //Wifi Name
const char* password = "PASSWORD"; //Wifi password

int port = 80;
int counter = 0;

void initWiFi() {
  // Initialisation
  Serial.println();
  Serial.print("Connecting to network: ");
  Serial.println(ssid);
  WiFi.disconnect(true); // disconnect from wifi to set new wifi connection
  WiFi.mode(WIFI_STA); // Init wifi mode

  // Start connecting to WiFi
  WiFi.begin(ssid, password); // connect to wifi
  Serial.print("Connecting to WiFi ...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
    counter++;
    if (counter >= 60) { // after 30 seconds timeout - reset board (on unsucessful connection)
      ESP.restart();
    }
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address set: ");
  Serial.println(WiFi.localIP()); // print LAN IP
}


void setup() {
  Serial.begin(115200); // Debugging
  Serial1.begin(115200, SERIAL_8N1, RXP1, TXP1); //Uart with Vision
  Serial2.begin(115200, SERIAL_8N1, RXP2, TXP2); //Uart with Drive
  
  vspi = new SPIClass(VSPI); //Initialising VSPI connection
  vspi->begin(VSPI_SCLK, VSPI_MISO, VSPI_MOSI, VSPI_SS);
  vspi->setClockDivider(SPI_CLOCK_DIV8);

  pinMode(VSPI_SS, OUTPUT);

  initWiFi();
  // timeClient.begin();
  HTTPClient http;
  String GetAddress, LinkGet, getData, name;
  GetAddress = "";
  LinkGet = host + GetAddress;
  name = "";
  
  // Your Domain name with URL path or IP address with path
  http.begin(LinkGet.c_str());
  
  // Send HTTP GET request
  int httpResponseCode = http.GET();
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  // Free resources
  http.end();
}


void loop() {
  // timeClient.update();
  if (!connected) {
    if (!client.connect(host, port)) {
      Serial.println("Connection to host failed");
      delay(100);
      return;
    }
    Serial.println("Connected to server successful!");
    client.print("Hello from ESP32!");
    connected = true;
  }

  // Checks if there is any data on the UART Vision datastream
  if (Serial1.available()) {
    // read the bytes incoming from the UART Port:
    for (int i = 0; i < 64; i++) {
      VisionMsg[i] = ' ';
    }
    char Visioninit = Serial1.read();

    if (!vision_msg_ready) {
      VisionMsg[0] = '[';
      VisionMsg[1] = Visioninit;
      int i = 2;

      while (Serial1.available()) {
        char Visionchar = Serial1.read();

        if (Visionchar != '\n') {
          VisionMsg[i] = Visionchar;
          i++;
        } else {
          Serial.println("The message from Vision has been recorded.");
          VisionMsg[i] = ']';
          break;
        }
      }
    }
  }

  // Checks if there is any data on the UART Drive datastream
  if (Serial2.available()) {
    // read the bytes incoming from the UART Port:
    char Driveinint = Serial2.read();

    if (Driveinint == '@' && !drive_ready) {
      Serial.println("Drive is ready to receive a command");
      drive_ready = true;
      vision_msg_ready = true;
    } else if (Driveinint == 'D' && !drive_msg_ready) {
      int i = 0;

      while (Serial2.available()) {
        char Drivechar = Serial2.read();

        if (Drivechar != '@' || Drivechar != 'Q') {
          DriveMsg[i] = Drivechar;
          i++;
        } else {
          Serial.println("The message from Drive has been recorded.");
          drive_msg_ready = true;
          break;
        }
      }
    } else if (Driveinint == 'Q' && !drive_msg_ready) {
      int i = 0;
      
      while (Serial2.available()) {
        char Drivechar = Serial2.read();
        
        if (Drivechar != '@') {
          DriveMsg[i] = Drivechar;
          i++;
        } else {
          Serial.println("The message from Drive has been recorded.");
          drive_msg_ready = true;
          break;
        }
      }
    }
  }

  // Checks if there is any data on the TCP datastream and 
  // if so, reads it and echos it back to the server.
  if (client.available() && !command_ready) {
    // read the bytes incoming from the server:
    char Commandinit = client.read();

    if (Commandinit == '[') {
      Command[0] = Commandinit;
      int i = 1;

      while (client.available()) {
        char Commandchar = client.read();

        if (Commandchar != ']') {
          Command[i] = Commandchar;
          i++;
        } else {
          Command[i] = ']';
          Serial.println("The Command has been recorded.");
          command_ready = true;
          break;
        }
      }
    } else if (Commandinit == 'S') {
      Command[0] = Commandinit;

      Serial.println("The Stop signal has been recorded.");
      Serial.print("Sending Stop signal to drive: ");

      Serial.write(Command[0]);
      Serial2.write(Command[0]);

      Command[0] = ' ';
    }
  }

  // Checks if drive and command are ready for moving the rover
  if (drive_ready && command_ready) {
    Serial.print("Sending command to drive: ");

    for (int i = 0; i < 32; i++) {
      Serial.write(Command[i]);
      Serial2.write(Command[i]);
      Command[i] = ' ';
    }
    Serial.println();
    Serial2.write('\n');

    drive_ready = false;
    command_ready = false;
  }

  // Checks if drive has a message for command
  if (drive_msg_ready) {
    Serial.print("Sending message to command: ");

    for (int i = 0; i < 32; i++) {
      Serial.write(DriveMsg[i]);
      client.write(DriveMsg[i]);

      DriveMsg[i] = ' ';
    }
    Serial.println();
    client.write('\n');
    drive_msg_ready = false;
  }

  // Checks if vision has a message for command
  if (vision_msg_ready) {
    Serial.print("Sending message to command: ");

    for (int i = 0; i < 64; i++) {
      Serial.write(VisionMsg[i]);
      client.write(VisionMsg[i]);

      VisionMsg[i] = ' ';
    }
    Serial.println();
    vision_msg_ready = false;
  }
}