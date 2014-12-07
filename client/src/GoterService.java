package com.enlix.goter;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;
import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;

import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.*;
import android.net.Uri;
import com.ionicframework.goter917690.R;
//import android.R;
import android.os.Bundle;
import android.view.View;
import android.content.Context;
import android.content.Intent;

import com.red_folder.phonegap.plugin.backgroundservice.BackgroundService;

public class GoterService extends BackgroundService {

	private final static String TAG = GoterService.class.getSimpleName();

	private String mHelloTo = "World";
	private Integer notCounter = 0;

	final static String GROUP_KEY_GOTER = "group_key_goter";

	@Override
	protected JSONObject doWork() {
		JSONObject result = new JSONObject();
		@SuppressWarnings("deprecation")
		NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(this)
			.setSmallIcon(R.drawable.icon)
			.setContentTitle("My notification")
			.setContentText("Hello World!")
			.setGroup(GROUP_KEY_GOTER);
		// Creates an explicit intent for an Activity in your app
		Intent resultIntent = new Intent(this, GoterService.class);

		// The stack builder object will contain an artificial back stack for the
		// started Activity.
		// This ensures that navigating backward from the Activity leads out of
		// your application to the Home screen.
		TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);
		// Adds the back stack for the Intent (but not the Intent itself)
		stackBuilder.addParentStack(GoterService.class);
		// Adds the Intent that starts the Activity to the top of the stack
		stackBuilder.addNextIntent(resultIntent);
		PendingIntent resultPendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
		mBuilder.setContentIntent(resultPendingIntent);
		NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
		// mId allows you to update the notification later on.
		mNotificationManager.notify(notCounter, mBuilder.build());
		notCounter++;

		try {
			SimpleDateFormat df = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
			String now = df.format(new Date(System.currentTimeMillis()));

			String msg = "Hello " + this.mHelloTo + " - its currently " + now;
			result.put("Message", msg);

			Log.d(TAG, msg);
		} catch (JSONException e) {}

		return result;
	}

	@Override
	protected JSONObject getConfig() {
		JSONObject result = new JSONObject();

		try {
			result.put("HelloTo", this.mHelloTo);
		} catch (JSONException e) {}

		return result;
	}

	@Override
	protected void setConfig(JSONObject config) {
		try {
			if (config.has("HelloTo")) this.mHelloTo = config.getString("HelloTo");
		} catch (JSONException e) {}

	}

	@Override
	protected JSONObject initialiseLatestResult() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	protected void onTimerEnabled() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void onTimerDisabled() {
		// TODO Auto-generated method stub

	}


}