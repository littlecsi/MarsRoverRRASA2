#include <Arduino.h>
// #include <NTPClient.h>
#include <WiFiUdp.h>
#include <WiFiClientSecure.h>

#include <SPI.h>
#include <WiFi.h>
#include "esp_wpa2.h"
#include <Wire.h>

#define RXP1 16 //Defining UART With Vision (Pins 8 and 9 on Arduino Adaptor)
#define TXP1 17
#define RXP2 18 //Defining UART With Drive (Pins 6 and 7 on Arduino Adaptor)
#define TXP2 5

#define VSPI_MISO 15 //Defining SPI with Camera on Vision (Pins 10, 11, 12 and 13 on Arduino Adaptor)
#define VSPI_MOSI 4
#define VSPI_SCLK 2
#define VSPI_SS 14

#define EAP_ANONYMOUS_IDENTITY "lc2120@ic.ac.uk" //anonymous identity
#define EAP_IDENTITY "lc2120@ic.ac.uk"// user identity
#define EAP_PASSWORD "PASSWORD" //eduroam user password

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

const char* ssid = "Imperial-WPA"; // eduroam SSID
const char* host = "http://192.168.203.3/"; // local
// const char* host = "http://34.226.193.83/"; // aws
int port = 443;
int counter = 0;
const char* test_root_ca = \
                           "-----BEGIN CERTIFICATE-----\n" \
                           "MIIDrzCCApegAwIBAgIQCDvgVpBCRrGhdWrJWZHHSjANBgkqhkiG9w0BAQUFADBh\n" \
                           "MQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQLExB3\n" \
                           "d3cuZGlnaWNlcnQuY29tMSAwHgYDVQQDExdEaWdpQ2VydCBHbG9iYWwgUm9vdCBD\n" \
                           "QTAeFw0wNjExMTAwMDAwMDBaFw0zMTExMTAwMDAwMDBaMGExCzAJBgNVBAYTAlVT\n" \
                           "MRUwEwYDVQQKEwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5j\n" \
                           "b20xIDAeBgNVBAMTF0RpZ2lDZXJ0IEdsb2JhbCBSb290IENBMIIBIjANBgkqhkiG\n" \
                           "9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4jvhEXLeqKTTo1eqUKKPC3eQyaKl7hLOllsB\n" \
                           "CSDMAZOnTjC3U/dDxGkAV53ijSLdhwZAAIEJzs4bg7/fzTtxRuLWZscFs3YnFo97\n" \
                           "nh6Vfe63SKMI2tavegw5BmV/Sl0fvBf4q77uKNd0f3p4mVmFaG5cIzJLv07A6Fpt\n" \
                           "43C/dxC//AH2hdmoRBBYMql1GNXRor5H4idq9Joz+EkIYIvUX7Q6hL+hqkpMfT7P\n" \
                           "T19sdl6gSzeRntwi5m3OFBqOasv+zbMUZBfHWymeMr/y7vrTC0LUq7dBMtoM1O/4\n" \
                           "gdW7jVg/tRvoSSiicNoxBN33shbyTApOB6jtSj1etX+jkMOvJwIDAQABo2MwYTAO\n" \
                           "BgNVHQ8BAf8EBAMCAYYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUA95QNVbR\n" \
                           "TLtm8KPiGxvDl7I90VUwHwYDVR0jBBgwFoAUA95QNVbRTLtm8KPiGxvDl7I90VUw\n" \
                           "DQYJKoZIhvcNAQEFBQADggEBAMucN6pIExIK+t1EnE9SsPTfrgT1eXkIoyQY/Esr\n" \
                           "hMAtudXH/vTBH1jLuG2cenTnmCmrEbXjcKChzUyImZOMkXDiqw8cvpOp/2PV5Adg\n" \
                           "06O/nVsJ8dWO41P0jmP6P6fbtGbfYmbW0W5BjfIttep3Sp+dWOIrWcBAI+0tKIJF\n" \
                           "PnlUkiaY4IBIqDfv8NZ5YBberOgOzW6sRBc4L0na4UU+Krk2U886UAb3LujEV0ls\n" \
                           "YSEY1QSteDwsOoBrp+uvFRTp2InBuThs4pFsiv9kuXclVzDAGySj4dzp30d8tbQk\n" \
                           "CAUw7C29C79Fv1C5qfPrmAESrciIxpg0X40KPMbp1ZWVbd4=\n" \
                           "-----END CERTIFICATE-----\n";

void initWiFi() {
  // Initialisation
  Serial.println();
  Serial.print("Connecting to network: ");
  Serial.println(ssid);
  WiFi.disconnect(true); // disconnect from wifi to set new wifi connection
  WiFi.mode(WIFI_STA); // Init wifi mode

  // Start connecting to WiFi
  esp_wifi_sta_wpa2_ent_set_identity((uint8_t *)EAP_ANONYMOUS_IDENTITY, strlen(EAP_ANONYMOUS_IDENTITY)); //provide identity
  esp_wifi_sta_wpa2_ent_set_username((uint8_t *)EAP_IDENTITY, strlen(EAP_IDENTITY)); //provide username
  esp_wifi_sta_wpa2_ent_set_password((uint8_t *)EAP_PASSWORD, strlen(EAP_PASSWORD)); //provide password
  esp_wifi_sta_wpa2_ent_enable();
  WiFi.begin(ssid); // connect to wifi
  Serial.print("Connecting to WiFi ...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
    counter++;
    if (counter >= 60) { // after 30 seconds timeout - reset board (on unsucessful connection)
      ESP.restart();
    }
  }
  client.setCACert(test_root_ca);
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