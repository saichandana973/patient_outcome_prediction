import torch
import torch.nn as nn

# 🧠 Dummy structure — we’ll update to match your real architecture later
class GATLSTMModel(nn.Module):
    def __init__(self, input_size=32, hidden_size=64, output_size=2):
        super(GATLSTMModel, self).__init__()
        self.lstm = nn.LSTM(input_size, hidden_size, batch_first=True)
        self.fc = nn.Linear(hidden_size, output_size)

    def forward(self, x):
        out, _ = self.lstm(x)
        out = self.fc(out[:, -1, :])
        return out

def load_gatlstm_model(model_path="app/models/gatlstm_model.pth"):
    model = GATLSTMModel()
    model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
    model.eval()
    print("✅ GAT-LSTM model loaded successfully!")
    return model
