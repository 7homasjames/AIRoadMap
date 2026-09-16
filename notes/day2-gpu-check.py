"""Day 2 environment verification: toy training loop on GPU."""
import time

import torch
import torch.nn as nn

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

torch.manual_seed(0)
X = torch.randn(2048, 20, device=device)
true_w = torch.randn(20, 1, device=device)
y = X @ true_w + 0.1 * torch.randn(2048, 1, device=device)

model = nn.Linear(20, 1).to(device)
optimizer = torch.optim.SGD(model.parameters(), lr=0.05)
loss_fn = nn.MSELoss()

start = time.time()
for epoch in range(200):
    optimizer.zero_grad()
    pred = model(X)
    loss = loss_fn(pred, y)
    loss.backward()
    optimizer.step()

torch.cuda.synchronize() if device.type == "cuda" else None
elapsed = time.time() - start

print(f"Final loss: {loss.item():.6f}")
print(f"Trained 200 steps on {device} in {elapsed:.3f}s")
