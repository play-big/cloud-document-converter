import SafariServices
import SwiftUI

class SafariExtensionHandler: SFSafariExtensionHandler {
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        // Handle messages from the extension
        page.dispatchMessageToScript(withName: messageName, userInfo: userInfo)
    }
    
    override func toolbarItemClicked(in window: SFSafariWindow) {
        // Handle toolbar item click
        window.getActiveTab { tab in
            tab?.getActivePage { page in
                page?.dispatchMessageToScript(withName: "toolbarClicked", userInfo: nil)
            }
        }
    }
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        validationHandler(true, "Cloud Document Converter")
    }
}
