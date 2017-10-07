/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.edu.uniandes.csw.iflow.tests.postman.collections;

import co.edu.uniandes.csw.iflow.dtos.detail.VideoDetailDTO;
import co.edu.uniandes.csw.auth.conexions.AuthenticationApi;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.mashape.unirest.http.exceptions.UnirestException;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Iterator;
import java.lang.Class;
import java.lang.reflect.InvocationTargetException;
import java.util.concurrent.ExecutionException;
import org.json.JSONException;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
/**
 *
 * @author Asistente
 */
public class VideoPrepare  {
    
   private static final String PATH = System.getProperty("user.dir").concat("\\collections\\postman_collectionVideo.json");
   private static final String PATHENV = System.getProperty("user.dir").concat("\\collections\\postman_env.json");

 public static Integer findJsonIndex(JsonArray jarray,String action){
     Iterator<JsonElement> it=jarray.iterator();
     int count =0;
    while(it.hasNext()){
       if(it.next().getAsJsonObject().get("name").getAsString().contains(action))
          break;
       count++;
           }
    return count;
 }
public static void setCollectionBody(JsonElement jsonElement,Integer index,VideoDetailDTO videos,Gson gson) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException{

String val=getFields(videos);
 
jsonElement.getAsJsonObject().get("item")
      .getAsJsonArray().get(index)
      .getAsJsonObject().get("request")
      .getAsJsonObject().get("body")
      .getAsJsonObject().addProperty("raw", val);
}
    /**
     * @return the PATH
     */
    public static String getPATH() {
        return PATH;
    }
    public static String getFields(VideoDetailDTO videos) throws IllegalAccessException, IllegalArgumentException, InvocationTargetException{
        String open="{\"";
        String content="";
        String close="}";
  for(Method m:videos.getClass().getMethods()){
           if(m.getName().contains("getName") & !"getClass".equals(m.getName())) {
         content=content.concat(m.getName().substring(3).toLowerCase().concat("\":\"").concat(m.invoke(videos, null).toString().concat("\",\""))); 
           }
          if(m.getName().contains("getId") & !"getClass".equals(m.getName())) {
         content=content.concat(m.getName().substring(3).toLowerCase().concat("\":\"").concat(m.invoke(videos, null).toString().concat("\",\""))); 
           }
       }
     return open.concat(content).substring(0,open.concat(content).length()-2 ).concat(close);
  
    } 

    /**
     * @return the PATHENV
     */
    public static String getPATHENV() {
        return PATHENV;
    }
    public static void loginCredentials() throws FileNotFoundException, IOException, ParseException, UnirestException, JSONException, InterruptedException, ExecutionException{

        AuthenticationApi api = new AuthenticationApi();
   JSONParser parser = new JSONParser();
   Gson gson = new Gson();
   Object obj;
       try (FileReader fr = new FileReader(PATHENV)) {
           obj = parser.parse(fr);
            fr.close();
       }
        JsonElement je = gson.toJsonTree(obj);
        je.getAsJsonObject()
                .get("values").getAsJsonArray()
                .get(0).getAsJsonObject().addProperty("value", api.getProp().getProperty("username"));
        je.getAsJsonObject()
                .get("values").getAsJsonArray()
                .get(1).getAsJsonObject().addProperty("value", api.getProp().getProperty("password"));
                
       FileWriter fw = new FileWriter(PATHENV);
       fw.write(je.toString());
       fw.flush();
       fw.close();

    }
   
}

