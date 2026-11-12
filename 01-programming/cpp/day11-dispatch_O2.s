	.file	"day11-dispatch.cpp"
	.intel_syntax noprefix
	.text
	.section	.text$_ZN4Base9calculateEv,"x"
	.linkonce discard
	.align 2
	.p2align 4
	.globl	"_ZN4Base9calculateEv"
	.def	"_ZN4Base9calculateEv";	.scl	2;	.type	32;	.endef
	.seh_proc	"_ZN4Base9calculateEv"
"_ZN4Base9calculateEv":
.LFB0:
	.seh_endprologue
	mov	eax, 10
	ret
	.seh_endproc
	.section	.text$_ZN7Derived9calculateEv,"x"
	.linkonce discard
	.align 2
	.p2align 4
	.globl	"_ZN7Derived9calculateEv"
	.def	"_ZN7Derived9calculateEv";	.scl	2;	.type	32;	.endef
	.seh_proc	"_ZN7Derived9calculateEv"
"_ZN7Derived9calculateEv":
.LFB1:
	.seh_endprologue
	mov	eax, 20
	ret
	.seh_endproc
	.text
	.p2align 4
	.globl	"_Z12callFunctionP4Base"
	.def	"_Z12callFunctionP4Base";	.scl	2;	.type	32;	.endef
	.seh_proc	"_Z12callFunctionP4Base"
"_Z12callFunctionP4Base":
.LFB2:
	.seh_endprologue
	lea	rdx, "_ZN7Derived9calculateEv"[rip]
	mov	rax, QWORD PTR [rcx]
	mov	rax, QWORD PTR [rax]
	cmp	rax, rdx
	je	.L6
	lea	r8, "_ZN4Base9calculateEv"[rip]
	mov	edx, 10
	cmp	rax, r8
	jne	.L8
	mov	eax, edx
	ret
	.p2align 4,,10
	.p2align 3
.L8:
	rex.W jmp	rax
	.p2align 4,,10
	.p2align 3
.L6:
	mov	edx, 20
	mov	eax, edx
	ret
	.seh_endproc
	.p2align 4
	.globl	"_Z9callKnownv"
	.def	"_Z9callKnownv";	.scl	2;	.type	32;	.endef
	.seh_proc	"_Z9callKnownv"
"_Z9callKnownv":
.LFB3:
	.seh_endprologue
	mov	eax, 20
	ret
	.seh_endproc
	.ident	"GCC: (MinGW-W64 x86_64-ucrt-posix-seh, built by Brecht Sanders, r4) 16.1.0"
