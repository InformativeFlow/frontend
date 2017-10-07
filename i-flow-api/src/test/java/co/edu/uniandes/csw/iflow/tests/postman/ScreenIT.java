/*
The MIT License (MIT)

Copyright (c) 2015 Los Andes University

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
package co.edu.uniandes.csw.iflow.tests.postman;

import co.edu.uniandes.csw.iflow.tests.postman.collections.ScreenPrepare;
import co.edu.uniandes.csw.iflow.entities.ScreenEntity;
import co.edu.uniandes.csw.iflow.dtos.detail.ScreenDetailDTO;
import co.edu.uniandes.csw.iflow.resources.ScreenResource;
import co.edu.uniandes.csw.iflow.tests.Utils;
import com.mashape.unirest.http.exceptions.UnirestException;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.RandomAccessFile;
import java.util.logging.Logger;
import javax.inject.Inject;
import java.lang.reflect.InvocationTargetException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import javax.inject.Inject;
import javax.transaction.UserTransaction;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.Entity;
import javax.ws.rs.client.WebTarget;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import org.codehaus.jackson.map.ObjectMapper;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.jboss.shrinkwrap.resolver.api.maven.Maven;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

/*
 * Testing URI: screens/
 */
@RunWith(Arquillian.class)
public class ScreenIT {
 
    private static final String BASEPATH = System.getProperty("user.dir");
   String path= BASEPATH.concat("\\collections\\runners\\screensCollectionRunner.bat");
   PodamFactory factory = new PodamFactoryImpl();
   JSONParser parser = new JSONParser();
   Gson gson = new Gson();

    @Deployment
    public static WebArchive createDeployment() {
        return ShrinkWrap.create(WebArchive.class,"i-flow-api.war")
                // Se agrega las dependencias
                .addAsLibraries(Maven.resolver().loadPomFromFile("pom.xml")
                        .importRuntimeDependencies().resolve()
                        .withTransitivity().asFile())
                // Se agregan los compilados de los paquetes de servicios
                .addPackage(ScreenResource.class.getPackage())
                .addPackage("co.edu.uniandes.csw.auth.properties")
                // El archivo que contiene la configuracion a la base de datos.
                .addAsResource("META-INF/persistence.xml", "META-INF/persistence.xml")
                // El archivo beans.xml es necesario para injeccion de dependencias.
                .addAsWebInfResource(new File("src/main/webapp/WEB-INF/beans.xml"))
                
                // El archivo web.xml es necesario para el despliegue de los servlets
                .setWebXML(new File("src/main/webapp/WEB-INF/web.xml"));
    }
   
    public void setPostmanCollectionValues(String action) throws FileNotFoundException, IOException, ParseException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, UnirestException, JSONException, InterruptedException, ExecutionException{
    
    try(FileWriter wrt = new FileWriter(path)){
        wrt.write("newman run ".concat(BASEPATH.concat("\\collections\\postman_collectionScreen.json").concat(" -e ").concat(BASEPATH.concat("\\collections\\postman_env.json").concat(" --disable-unicode"))));
    wrt.flush();
    }
     
    Object obj;
       try (FileReader reader = new FileReader(ScreenPrepare.getPATH())) {
           obj = parser.parse(reader);
       } 
       try (FileWriter writer = new FileWriter(ScreenPrepare.getPATH())) {
           ScreenDetailDTO Screen = factory.manufacturePojo(ScreenDetailDTO.class);
           JsonArray jsonArray=gson.toJsonTree(obj).getAsJsonObject().get("item").getAsJsonArray();
           Integer index= ScreenPrepare.findJsonIndex(jsonArray,action);
           JsonElement jsonElement=gson.toJsonTree(obj);
           ScreenPrepare.setCollectionBody(jsonElement, index, Screen, gson);
           writer.write(jsonElement.toString());
           writer.flush();
       }
}


    @Test 
    public void postman() throws FileNotFoundException, IOException, ParseException, IllegalAccessException, IllegalArgumentException, InvocationTargetException, UnirestException, JSONException, InterruptedException, ExecutionException{
      ScreenPrepare.loginCredentials(); 
      setPostmanCollectionValues("create");
      setPostmanCollectionValues("edit");

   try {              
            Process process = Runtime.getRuntime().exec(path);
            InputStream inputStream = process.getInputStream();
            BufferedReader bf= new BufferedReader(new InputStreamReader(inputStream));
            String line="";
            String ln;
            while ((ln=bf.readLine()) != null) {
                line=line.concat(ln+"\n");
            }
              System.out.println(line);   
            inputStream.close();
            bf.close();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } 
    }
}
