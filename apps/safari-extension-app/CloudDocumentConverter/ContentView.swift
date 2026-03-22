import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "doc.text")
                .font(.system(size: 60))
                .foregroundColor(.blue)
            
            Text("Cloud Document Converter")
                .font(.title)
                .fontWeight(.bold)
            
            Text("Convert Lark cloud documents to Markdown")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            
            VStack(alignment: .leading, spacing: 10) {
                Text("How to use:")
                    .font(.headline)
                
                Text("1. Open Safari and navigate to a Lark document")
                    .font(.body)
                Text("2. Right-click on the page or use the toolbar button")
                    .font(.body)
                Text("3. Choose 'Download as Markdown' or 'Copy as Markdown'")
                    .font(.body)
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(10)
            
            Spacer()
            
            Text("Version 1.0.0")
                .font(.footnote)
                .foregroundColor(.secondary)
        }
        .padding()
        .frame(minWidth: 400, minHeight: 400)
    }
}

#Preview {
    ContentView()
}
