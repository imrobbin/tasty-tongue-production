package in.fullstackdevs.tastytongue;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;

import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;

import com.getcapacitor.community.fcm.FCMPlugin;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      add(GoogleAuth.class);
      add(FCMPlugin.class);
    }});
  }
}
