package com.enlix.goter;

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import java.text.SimpleDateFormat;
import java.util.Date;

public class GoterService extends BackgroundService {
	@Override
	protected JSONObject doWork() {
	     JSONObject result = new JSONObject();

		   try {
		      // Following three lines simply produce a text string with Hello World and the date & time (UK format)
		      SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss"); 
		      String now = df.format(new Date(System.currentTimeMillis())); 
		      String msg = "Hello World - its currently " + now;

		      // We output the message to the logcat
		      Log.d("MyService", msg);

		      // We also provide the same message in our JSON Result
		      result.put("Message", msg);
		   } catch (JSONException e) {
		      // In production code, you would have some exception handling here
		   }

		   return result;  
	}

	@Override
	protected JSONObject getConfig() {
	   return null;
	}

	@Override
	protected void setConfig(JSONObject config) {
	   return null;
	}     

	@Override
	protected JSONObject initialiseLatestResult() {
	   return null;
	}
}