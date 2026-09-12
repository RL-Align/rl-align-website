git clone https://github.com/RL-Align/RL-Kernel.git
cd RL-Kernel

# NVIDIA SM90: H100, H200, GH200
MAX_JOBS=8 \
RL_KERNEL_REQUIRE_EXT=1 \
TORCH_CUDA_ARCH_LIST="9.0+PTX" \
  python3 -m pip install --no-build-isolation --no-deps -e .

# Verify the GPU, SM capability, and native extension.
python3 -c "import torch, rl_engine._C as C; \
print('GPU:', torch.cuda.get_device_name(0)); \
print('SM:', torch.cuda.get_device_capability(0)); \
print('Extension:', C.__file__); assert hasattr(C, 'fused_logp')"
